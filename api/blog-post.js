const {verifyAdminSession} = require('../lib/admin-auth');
const fs = require('fs/promises');
const path = require('path');
const redisUrl = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const scope = process.env.VERCEL_ENV === 'production' ? 'production' : 'preview';
const KEY = `diemchau:blog-posts:${scope}:v1`;
const escapeHTML = value => String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

async function readPosts() {
  const response = await fetch(redisUrl(), {method:'POST',headers:{'Authorization':`Bearer ${redisToken()}`,'Content-Type':'application/json'},body:JSON.stringify(['GET',KEY])});
  if (!response.ok) throw new Error('Redis unavailable');
  const json = await response.json();
  if (json.error) throw new Error('Redis command error');
  return json.result ? JSON.parse(json.result) : [];
}

function render(post, canonical) {
  const title = escapeHTML(post.title);
  const desc = escapeHTML(post.description || post.title);
  const canonicalEscaped = escapeHTML(canonical);
  const robots = post.robots === 'noindex, follow' || process.env.VERCEL_ENV !== 'production' ? '<meta name="robots" content="noindex, follow">' : '';
  const image = post.image && !post.image.startsWith('data:') ? `<meta property="og:image" content="${escapeHTML(post.image)}">` : '';
  const date = new Date(post.updatedAt || post.createdAt || Date.now()).toISOString();
  const schema = JSON.stringify({'@context':'https://schema.org','@type':'BlogPosting','headline':post.title,'description':post.description || post.title,'datePublished':post.createdAt || date,'dateModified':post.updatedAt || date,'mainEntityOfPage':canonical,'image':post.image && !post.image.startsWith('data:') ? [post.image] : undefined,'author':{'@type':'Organization','name':'Nhà nghỉ Diễm Châu Phú Quốc'},'publisher':{'@type':'Organization','name':'Nhà nghỉ Diễm Châu Phú Quốc'}}).replace(/</g,'\\u003c');
  const content = post.content.replaceAll('__DC_BLOG_COVER__',escapeHTML(post.image || ''));
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} | Nhà nghỉ Diễm Châu Phú Quốc</title><meta name="description" content="${desc}"><link rel="canonical" href="${canonicalEscaped}">${robots}<meta property="og:type" content="article"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">${image}<link rel="stylesheet" href="/css/article-v1.css"><link rel="stylesheet" href="/css/mobile-navigation.css"><script src="/js/common.js?v=5" defer></script><script type="application/ld+json">${schema}</script><style>body{margin:0;background:#fcf9f8;color:#1b1c1c;font:16px/1.7 'Be Vietnam Pro',Arial,sans-serif}header{background:#1b3a4b;padding:18px;color:white}header a{color:white}main{max-width:850px;margin:40px auto;padding:0 20px}h1{font-size:clamp(30px,5vw,44px);line-height:1.2;color:#012435}.post-content img{max-width:100%;height:auto;border-radius:12px}.post-content figure{margin:24px 0}.post-content figcaption{font-size:.9em;color:#555}.post-content table{display:block;max-width:100%;overflow:auto;border-collapse:collapse}.post-content th,.post-content td{border:1px solid #c2c7cc;padding:8px}a{color:#012435}</style></head><body><header><a href="/">Nhà nghỉ Diễm Châu Phú Quốc</a> · <a href="/blog">Cẩm nang</a></header><main><nav aria-label="Đường dẫn"><a href="/">Trang chủ</a> / <a href="/blog">Cẩm nang</a></nav><p>${escapeHTML(post.category || 'Cẩm Nang Du Lịch')}</p><h1>${title}</h1><p>${desc}</p><article class="post-content">${content}</article><p><a href="/blog">← Quay lại Cẩm nang</a></p></main></body></html>`;
}

module.exports = async (req,res) => {
  res.setHeader('X-Content-Type-Options','nosniff');
  const slug = String(req.query?.slug || '').toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return res.status(400).send('Đường dẫn bài viết không hợp lệ.');
  try {
    let post = null;
    if (redisUrl() && redisToken()) post = (await readPosts()).find(item => item.slug === slug);
    if (post && post.status !== 'published' && !verifyAdminSession(req)) return res.status(404).send('Không tìm thấy bài viết.');
    if (post && (post.status === 'published' || verifyAdminSession(req))) {
      const canonical = `https://www.diemchauphuquoc.io.vn/blog/${slug}`;
      res.setHeader('Cache-Control',post.status === 'published' ? 'public, s-maxage=60, stale-while-revalidate=300' : 'no-store');
      res.setHeader('Content-Type','text/html; charset=utf-8');
      return res.status(200).send(render(post,canonical));
    }
    let html;
    try { html = await fs.readFile(path.join(process.cwd(),'blog',`${slug}.html`),'utf8'); }
    catch { return res.status(404).send('Không tìm thấy bài viết.'); }
    res.setHeader('Cache-Control','no-store');
    res.setHeader('Content-Type','text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (error) {
    console.error('Blog page error:',error.message);
    try {
      const html = await fs.readFile(path.join(process.cwd(),'blog',`${slug}.html`),'utf8');
      res.setHeader('Cache-Control','no-store'); res.setHeader('Content-Type','text/html; charset=utf-8');
      return res.status(200).send(html);
    } catch { return res.status(503).send('Chưa tải được bài viết.'); }
  }
};
