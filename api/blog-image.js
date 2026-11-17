const {verifyAdminSession} = require('../lib/admin-auth');

const redisUrl = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const scope = process.env.VERCEL_ENV === 'production' ? 'production' : 'preview';
const KEY = `diemchau:blog-posts:${scope}:v1`;

module.exports = async (req,res) => {
  res.setHeader('X-Content-Type-Options','nosniff');
  if (req.method !== 'GET') return res.status(405).send('Phương thức không được hỗ trợ.');
  const slug = String(req.query?.slug || '').toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return res.status(400).send('Đường dẫn ảnh không hợp lệ.');
  if (!redisUrl() || !redisToken()) return res.status(503).send('Kho ảnh bài viết chưa được cấu hình.');
  try {
    const response = await fetch(redisUrl(), {method:'POST',headers:{'Authorization':`Bearer ${redisToken()}`,'Content-Type':'application/json'},body:JSON.stringify(['GET',KEY])});
    if (!response.ok) throw new Error('Redis unavailable');
    const result = await response.json();
    if (result.error) throw new Error('Redis command error');
    const posts = result.result ? JSON.parse(result.result) : [];
    const post = Array.isArray(posts) ? posts.find(item => item.slug === slug) : null;
    if (!post || (post.status !== 'published' && !verifyAdminSession(req))) return res.status(404).send('Không tìm thấy ảnh.');
    const match = /^data:image\/(png|jpeg|webp);base64,([a-z0-9+/]+=*)$/i.exec(String(post.image || ''));
    if (!match) return res.status(404).send('Bài viết không có ảnh tải lên.');
    const bytes = Buffer.from(match[2],'base64');
    if (!bytes.length || bytes.length > 700_000) return res.status(404).send('Ảnh không hợp lệ.');
    res.setHeader('Content-Type',`image/${match[1].toLowerCase()}`);
    res.setHeader('Cache-Control',post.status === 'published' ? 'public, s-maxage=300, stale-while-revalidate=3600' : 'private, no-store');
    res.setHeader('Content-Length',String(bytes.length));
    return res.status(200).send(bytes);
  } catch (error) {
    console.error('Blog image error:',error.message);
    return res.status(503).send('Chưa tải được ảnh bài viết.');
  }
};
