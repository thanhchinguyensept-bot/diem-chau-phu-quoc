const {verifyAdminSession} = require('../lib/admin-auth');

const redisUrl = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const scope = process.env.VERCEL_ENV === 'production' ? 'production' : 'preview';
const KEY = `diemchau:blog-posts:${scope}:v1`;
const MAX_POSTS = 50;
const MAX_POST_BYTES = 850_000;
const MAX_STORE_BYTES = 3_000_000;
const fail = (res, status, message) => res.status(status).json({success:false,message});

async function command(parts) {
  const response = await fetch(redisUrl(), {method:'POST',headers:{'Authorization':`Bearer ${redisToken()}`,'Content-Type':'application/json'},body:JSON.stringify(parts)});
  if (!response.ok) throw new Error('Redis HTTP error');
  const json = await response.json();
  if (json.error) throw new Error('Redis command error');
  return json.result;
}

function bodyOf(req) {
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
  return req.body || {};
}

function slugify(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90).replace(/-$/g, '');
}

function cleanHTML(input) {
  let html = String(input || '');
  html = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style|iframe|object|embed|form|svg|math|video|audio)[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  const allowed = new Set(['p','div','br','hr','h1','h2','h3','h4','h5','h6','ul','ol','li','blockquote','strong','b','em','i','u','s','a','img','figure','figcaption','table','thead','tbody','tr','th','td','sup','sub']);
  html = html.replace(/<(\/?)([a-z0-9-]+)\b([^>]*)>/gi, (tag, slash, rawName, rawAttrs) => {
    const name = rawName.toLowerCase();
    if (!allowed.has(name)) return '';
    if (slash) return `</${name}>`;
    const attrs = [];
    const pattern = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
    let match;
    while ((match = pattern.exec(rawAttrs))) {
      const key = match[1].toLowerCase();
      const value = (match[2] ?? match[3] ?? match[4] ?? '').trim();
      if (key.startsWith('on') || key === 'style' || key === 'srcset' || key === 'class' || key === 'id') continue;
      if (name === 'a' && key === 'href' && /^(https?:\/\/|\/|#|mailto:)/i.test(value)) attrs.push(`href="${escapeAttr(value)}"`);
      if (name === 'img' && key === 'src' && (/^(https?:\/\/|\/)/i.test(value) || /^data:image\/(?:png|jpeg|webp);base64,/i.test(value))) attrs.push(`src="${escapeAttr(value)}"`);
      if ((name === 'img' && key === 'alt') || (name === 'td' && ['colspan','rowspan'].includes(key)) || (name === 'th' && ['colspan','rowspan','scope'].includes(key))) attrs.push(`${key}="${escapeAttr(value)}"`);
    }
    if (name === 'a') attrs.push('rel="noopener noreferrer"');
    if (name === 'img') { attrs.push('loading="lazy"'); attrs.push('decoding="async"'); }
    return `<${name}${attrs.length ? ' ' + attrs.join(' ') : ''}${['br','hr','img'].includes(name) ? '>' : '>'}`;
  });
  return html.trim();
}

function escapeAttr(value) {
  return String(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

async function readPosts() {
  const value = await command(['GET',KEY]);
  if (!value) return [];
  const posts = JSON.parse(value);
  return Array.isArray(posts) ? posts : [];
}

module.exports = async (req,res) => {
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Vary','Cookie');
  if (!redisUrl() || !redisToken()) return fail(res,503,'Kho bài viết chưa được cấu hình.');
  if (!['GET','POST','DELETE'].includes(req.method)) return fail(res,405,'Phương thức không được hỗ trợ.');
  const authenticated = verifyAdminSession(req);
  if (req.method !== 'GET' && !authenticated) return fail(res,401,'Cần đăng nhập quản trị để thay đổi bài viết.');
  if (req.method === 'GET' && req.query?.admin === '1' && !authenticated) return fail(res,401,'Phiên quản trị đã hết hạn.');
  try {
    const posts = await readPosts();
    if (req.method === 'GET') {
      const visible = authenticated ? posts : posts.filter(post => post.status === 'published');
      if (authenticated && req.query?.slug) {
        const detail = visible.find(post => post.slug === slugify(req.query.slug));
        return detail ? res.status(200).json({success:true,post:{...detail,content:detail.content.replaceAll('__DC_BLOG_COVER__',detail.image || '')}}) : fail(res,404,'Không tìm thấy bản quản lý bài viết.');
      }
      return res.status(200).json({success:true,posts:visible.map(({content,image,...post}) => ({...post,image:image?.startsWith('data:') ? `/api/blog-image?slug=${encodeURIComponent(post.slug)}` : image})),hiddenSlugs:authenticated ? [] : posts.filter(post => post.status !== 'published').map(post => post.slug)});
    }
    const body = bodyOf(req);
    const slug = slugify(req.query?.slug || body.slug || body.title);
    if (!slug) return fail(res,400,'Không tạo được đường dẫn từ tiêu đề.');
    if (req.method === 'DELETE') {
      const next = posts.filter(post => post.slug !== slug);
      await command(['SET',KEY,JSON.stringify(next)]);
      return res.status(200).json({success:true,slug});
    }
    const title = String(body.title || '').trim().slice(0,180);
    const description = String(body.description || '').trim().slice(0,320);
    const rawContent = String(body.content || '');
    if (Buffer.byteLength(rawContent,'utf8') > MAX_POST_BYTES) return fail(res,413,'Bài viết quá lớn. Hãy giảm dung lượng ảnh hoặc nội dung dưới 850 KB.');
    let content = cleanHTML(rawContent);
    const category = String(body.category || 'Cẩm Nang Du Lịch').trim().slice(0,80);
    const keywords = String(body.keywords || '').trim().slice(0,300);
    const status = body.status === 'published' ? 'published' : 'draft';
    const originalUrl = typeof body.originalUrl === 'string' && /^\/blog\/[a-z0-9-]+$/.test(body.originalUrl) ? body.originalUrl : '';
    const robots = status === 'draft' || body.robots === 'noindex' ? 'noindex, follow' : 'index, follow';
    const imageMatch = content.match(/<img\b[^>]*\bsrc="([^"]+)"/i);
    const imageSource = imageMatch?.[1] || '';
    const candidateImage = String(body.image || imageSource);
    if (candidateImage.length > 700_000) return fail(res,413,'Ảnh quá lớn sau khi dán. Hãy nén ảnh trước khi lưu.');
    const image = /^(?:https?:\/\/|\/|data:image\/(?:png|jpeg|webp);base64,)/i.test(candidateImage) ? candidateImage : '';
    if (title.length < 3) return fail(res,400,'Tiêu đề cần có ít nhất 3 ký tự.');
    if (content.length < 1) return fail(res,400,'Hãy nhập nội dung bài viết.');
    content = content.replace(/<\/?h1\b/gi, tag => tag.toLowerCase().startsWith('</') ? '</h2' : '<h2');
    if (/^data:/i.test(image)) content = content.replaceAll(`src="${image.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"`,`src="__DC_BLOG_COVER__"`);
    if (Buffer.byteLength(JSON.stringify({title,description,content,image,category,keywords}), 'utf8') > MAX_POST_BYTES) return fail(res,413,'Bài viết quá lớn. Hãy giảm dung lượng ảnh hoặc nội dung dưới 850 KB.');
    const now = new Date().toISOString();
    const existing = posts.find(post => post.slug === slug);
    if (!existing && posts.length >= MAX_POSTS) return fail(res,413,`Kho bài đã đạt giới hạn ${MAX_POSTS} bài. Hãy gỡ một bản quản lý không còn dùng rồi thử lại.`);
    const plainSummary = content.replace(/__DC_BLOG_COVER__/g,'ảnh').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,155);
    const post = {slug,title,description:description || plainSummary || title,content,category,keywords,status,image,robots,originalUrl:originalUrl || existing?.originalUrl || '',createdAt:existing?.createdAt || now,updatedAt:now};
    const next = [post,...posts.filter(item => item.slug !== slug)];
    const serialized = JSON.stringify(next);
    if (Buffer.byteLength(serialized,'utf8') > MAX_STORE_BYTES) return fail(res,413,'Kho bài viết đã gần giới hạn 3 MB. Hãy giảm dung lượng ảnh hoặc gỡ bài không dùng.');
    await command(['SET',KEY,serialized]);
    return res.status(existing ? 200 : 201).json({success:true,post:{...post,content:undefined}});
  } catch (error) {
    console.error('Blog storage error:', error.message);
    return fail(res,503,'Chưa đọc hoặc lưu được bài viết. Vui lòng thử lại.');
  }
};
