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

const CMS_RELATED_LINKS = {
  'tim-nha-nghi-gia-re-o-duong-dong-phu-quoc-dung-chi-nhin-gia-hay-nghe-tho-dia-boc-tach-that': [
    ['/blog/chon-nha-nghi-phu-quoc', 'Cách chọn nhà nghỉ bình dân và tính tổng tiền'],
    ['/blog/kiem-tra-co-so-luu-tru-phu-quoc-truoc-khi-dat-phong', 'Bốn bước kiểm tra cơ sở trước khi đặt phòng'],
    ['/blog/khach-san-hay-nha-nghi-duong-dong-hai-nguoi', 'So sánh khách sạn và nhà nghỉ ở Dương Đông']
  ],
  'cho-dem-phu-quoc-an-gi-ngon-ma-khong-lo-dau-vi-meo-that-tu-khach-han-khach-tay-tui-minh-o': [
    ['/blog/cho-dem-phu-quoc-buoi-toi-tu-duong-dong', 'Sắp xếp một buổi tối ở chợ đêm Phú Quốc'],
    ['/blog/top-quan-hai-san-ngon-re-phu-quoc', 'Gợi ý quán hải sản theo khu vực'],
    ['/blog/cho-duong-dong-buoi-sang-hay-cho-dem-phu-quoc', 'So sánh chợ Dương Đông ban ngày và chợ đêm']
  ]
};

function renderRelatedLinks(slug) {
  const links = CMS_RELATED_LINKS[slug] || [];
  if (!links.length) return '';
  return `<section class="mt-8 border-t border-outline-variant pt-6" aria-labelledby="related-articles-title"><h2 id="related-articles-title" class="text-xl font-bold text-primary mb-3">Bài viết liên quan</h2><ul class="list-disc pl-6 space-y-2">${links.map(([href,label]) => `<li><a class="font-semibold text-primary underline underline-offset-4" href="${href}">${label}</a></li>`).join('')}</ul></section>`;
}

function render(post, canonical) {
  const title = escapeHTML(post.title);
  const desc = escapeHTML(post.description || post.title);
  const canonicalEscaped = escapeHTML(canonical);
  const robots = post.robots === 'noindex, follow' || process.env.VERCEL_ENV !== 'production' ? '<meta name="robots" content="noindex, follow">' : '';
  const imageValue = post.image?.startsWith('data:') ? `https://www.diemchauphuquoc.io.vn/api/blog-image?slug=${encodeURIComponent(post.slug)}` : post.image;
  const publicImage = imageValue ? new URL(imageValue,canonical).href : '';
  const image = publicImage ? `<meta property="og:image" content="${escapeHTML(publicImage)}">` : '';
  const date = new Date(post.updatedAt || post.createdAt || Date.now()).toISOString();
  const schema = JSON.stringify({'@context':'https://schema.org','@type':'BlogPosting','headline':post.title,'description':post.description || post.title,'datePublished':post.createdAt || date,'dateModified':post.updatedAt || date,'mainEntityOfPage':canonical,'image':publicImage ? [publicImage] : undefined,'author':{'@type':'Organization','name':'Nhà nghỉ Diễm Châu Phú Quốc'},'publisher':{'@type':'Organization','name':'Nhà nghỉ Diễm Châu Phú Quốc'}}).replace(/</g,'\\u003c');
  const content = post.content.replaceAll('__DC_BLOG_COVER__',escapeHTML(publicImage || ''));
  const header = `<header class="site-navigation-header fixed top-0 left-0 w-full z-50 bg-primary-container shadow-[0_12px_28px_-4px_rgba(27,58,75,0.12)]"><div class="h-20 max-w-[1200px] mx-auto px-margin lg:px-margin-desktop flex items-center justify-between"><div class="flex items-center gap-space-sm"><a href="/" class="flex items-center gap-space-sm"><img src="/images/logo-diemchau-horizontal.png" alt="Diễm Châu – Riêng Tư Tuyệt Đối" class="h-9 w-auto object-contain" width="869" height="209" decoding="async"></a></div><nav class="hidden lg:flex items-center gap-space-lg"><a class="font-label-md text-label-md text-on-primary-container hover:text-on-primary transition-colors py-space-xs" data-path="trang-chu" data-i18n="nav_home" href="/">Trang Chủ</a><a class="font-label-md text-label-md text-on-primary-container hover:text-on-primary transition-colors py-space-xs" data-path="phong-nghi" data-i18n="nav_rooms" href="/rooms">Phòng Nghỉ</a><a class="font-label-md text-label-md text-on-primary-container hover:text-on-primary transition-colors py-space-xs" data-path="dat-phong" data-i18n="nav_booking" href="/booking">Đặt Phòng</a><a class="font-label-md text-label-md text-secondary-container font-semibold border-b-2 border-secondary-container py-space-xs" data-path="blog" data-i18n="nav_blog" href="/blog" aria-current="page">Blog</a><a class="font-label-md text-label-md text-on-primary-container hover:text-on-primary transition-colors py-space-xs" data-path="lien-he" data-i18n="nav_contact" href="/contact">Liên Hệ</a></nav><div class="flex items-center gap-space-md"><div class="flex items-center gap-space-xs px-space-sm py-space-xs rounded-lg bg-primary text-on-primary font-label-sm text-label-sm"><span class="material-symbols-outlined text-[16px] text-secondary-container">language</span><button type="button" id="btn-lang-vn" class="text-secondary-container font-bold cursor-pointer transition-colors">VN</button><span class="text-outline">|</span><button type="button" id="btn-lang-en" class="text-outline-variant hover:text-on-primary cursor-pointer transition-colors">EN</button></div><a class="hidden sm:inline-flex items-center justify-center h-12 px-space-lg rounded-xl bg-secondary-container hover:bg-accent-hover text-on-secondary-container hover:text-on-primary font-label-md text-label-md tracking-wider transition-all shadow-[0_2px_8px_-2px_rgba(27,58,75,0.06)]" href="/booking">ĐẶT NGAY</a></div></div></header>`;
  const footer = `<footer class="w-full bg-primary-container text-on-primary"><div class="max-w-[1200px] mx-auto px-margin lg:px-margin-desktop pt-space-xl pb-space-lg"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xl pb-space-xl"><div class="flex flex-col gap-space-sm"><div class="flex items-center gap-space-sm mb-space-xs"><img alt="Logo Nhà nghỉ Diễm Châu Phú Quốc" class="h-8 w-auto object-contain" src="/images/logo-diemchau.png" width="34" height="32"><span class="font-headline-sm text-headline-sm text-on-primary">DIỄM CHÂU</span></div><p class="font-body-sm text-body-sm text-on-primary-container">Nhà Nghỉ Diễm Châu có 4 phòng tại Dương Đông, Phú Quốc, phục vụ khách nghỉ theo giờ và qua đêm.</p><div class="flex items-center gap-space-xs text-secondary-container mt-space-xs"><span class="material-symbols-outlined text-[20px]">verified_user</span><span class="font-label-sm text-label-sm">Gọi hoặc nhắn Zalo để đặt phòng</span></div></div><div class="flex flex-col gap-space-sm"><h2 class="font-headline-sm text-headline-sm text-secondary-container">Liên Hệ</h2><div class="flex items-start gap-space-xs text-on-primary-container font-body-sm text-body-sm"><span class="material-symbols-outlined text-[18px] text-secondary-container shrink-0 mt-0.5">location_on</span><span>Nhà Nghỉ Diễm Châu, tổ 10, khu phố 10, Dương Đông, Phú Quốc</span></div><div class="flex items-center gap-space-xs text-on-primary-container font-body-sm text-body-sm"><span class="material-symbols-outlined text-[18px] text-secondary-container shrink-0">call</span><a href="tel:0815719502" class="hover:text-secondary-container transition-colors">0815 719 502</a></div></div><div class="flex flex-col gap-space-sm"><h2 class="font-headline-sm text-headline-sm text-secondary-container">Chính Sách &amp; Giờ Giấc</h2><ul class="flex flex-col gap-space-xs text-on-primary-container font-body-sm text-body-sm"><li>Linh hoạt theo giờ: 1h / 3h / 5h / Qua đêm</li><li>Lễ tân hướng dẫn nhận phòng. Nếu quầy vắng, hãy gọi hoặc nhắn Zalo.</li><li>Bảo mật thông tin khách hàng tuyệt đối</li><li>Đổi phòng hoặc hủy phòng không phụ thu khi báo trước 3 tiếng</li></ul></div><div class="flex flex-col gap-space-sm"><h2 class="font-headline-sm text-headline-sm text-secondary-container">Liên hệ đặt phòng</h2><p class="font-body-sm text-body-sm text-on-primary-container">Đội ngũ kỹ thuật &amp; CSKH luôn sẵn sàng đồng hành cùng kỳ nghỉ của bạn.</p><div class="p-space-md rounded-xl bg-primary flex items-center justify-between"><div class="flex flex-col"><span class="font-label-sm text-label-sm text-secondary-container uppercase">Khẩn cấp &amp; Đặt chỗ</span><a href="tel:0815719502" class="font-headline-sm text-headline-sm text-on-primary hover:text-secondary-container">0815 719 502</a></div><span class="material-symbols-outlined text-secondary-container text-[28px]">support_agent</span></div></div></div><div class="pt-space-md flex flex-col md:flex-row items-center justify-between text-on-primary-container font-body-sm text-body-sm gap-space-sm"><p>© 2025 Nhà Nghỉ Diễm Châu - Phú Quốc. Toàn bộ quyền được bảo lưu.</p><p class="font-label-sm text-label-sm text-secondary-container">Slogan: Riêng Tư Tuyệt Đối - Đón Tiếp Tận Tâm</p></div></div></footer>`;
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#012435"><link rel="icon" type="image/png" href="/favicon.png"><title>${title} | Nhà nghỉ Diễm Châu Phú Quốc</title><meta name="description" content="${desc}"><link rel="canonical" href="${canonicalEscaped}">${robots}<meta property="og:type" content="article"><meta property="og:url" content="${canonicalEscaped}"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">${image}<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" rel="stylesheet"><link rel="stylesheet" href="/css/article-v1.css"><link rel="stylesheet" href="/css/mobile-navigation.css"><script src="/js/common.js?v=5" defer></script><script type="application/ld+json">${schema}</script><style>html,body{margin:0;padding:0}body{overscroll-behavior:none}.post-content{overflow-wrap:anywhere}.post-content img{max-width:100%;height:auto;border-radius:12px}.post-content figure{margin:24px 0}.post-content figcaption{font-size:.9em;color:#555}.post-content table{display:block;max-width:100%;overflow:auto;border-collapse:collapse}.post-content th,.post-content td{border:1px solid #c2c7cc;padding:8px}</style></head><body class="bg-surface font-body-md text-on-surface">${header}<main class="pt-24 min-h-screen bg-surface"><article class="mx-auto max-w-3xl px-margin py-space-xl text-on-surface"><nav class="mb-4 text-sm" aria-label="Đường dẫn"><a class="font-semibold text-primary underline underline-offset-4" href="/">Trang chủ</a> / <a class="font-semibold text-primary underline underline-offset-4" href="/blog">Cẩm nang</a></nav><p class="text-secondary font-semibold mb-2">${escapeHTML(post.category || 'Cẩm Nang Du Lịch')}</p><h1 class="text-3xl md:text-4xl text-primary font-bold mb-4">${title}</h1><p class="text-lg text-on-surface-variant mb-5">${desc}</p><div class="post-content">${content}</div>${renderRelatedLinks(post.slug)}<p class="mt-8"><a class="font-semibold text-primary underline underline-offset-4" href="/blog">← Quay lại Cẩm nang</a></p></article></main>${footer}</body></html>`;
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
