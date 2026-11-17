const fs = require('fs/promises');
const path = require('path');

const redisUrl = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const scope = process.env.VERCEL_ENV === 'production' ? 'production' : 'preview';
const KEY = `diemchau:blog-posts:${scope}:v1`;
const ORIGIN = 'https://www.diemchauphuquoc.io.vn';

function xmlEscape(value) {
  return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}

module.exports = async (req,res) => {
  res.setHeader('Content-Type','application/xml; charset=utf-8');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Cache-Control','public, s-maxage=300, stale-while-revalidate=3600');
  if (req.method !== 'GET') return res.status(405).send('Method not allowed.');
  let xml;
  try { xml = await fs.readFile(path.join(process.cwd(),'sitemap-static.xml'),'utf8'); }
  catch { xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'; }
  if (!redisUrl() || !redisToken()) return res.status(200).send(xml);
  try {
    const response = await fetch(redisUrl(), {method:'POST',headers:{'Authorization':`Bearer ${redisToken()}`,'Content-Type':'application/json'},body:JSON.stringify(['GET',KEY])});
    if (!response.ok) throw new Error('Redis unavailable');
    const result = await response.json();
    if (result.error) throw new Error('Redis command error');
    const posts = result.result ? JSON.parse(result.result) : [];
    const known = new Set(Array.from(xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g),match => match[1].replaceAll('&amp;','&')));
    const entries = (Array.isArray(posts) ? posts : []).filter(post => post.status === 'published' && post.robots !== 'noindex, follow' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug))
      .map(post => `${ORIGIN}/blog/${post.slug}`)
      .filter(url => !known.has(url))
      .map(url => `<url><loc>${xmlEscape(url)}</loc></url>`)
      .join('');
    if (entries) xml = xml.replace('</urlset>',`${entries}</urlset>`);
  } catch (error) {
    console.error('Sitemap blog posts error:',error.message);
  }
  return res.status(200).send(xml);
};
