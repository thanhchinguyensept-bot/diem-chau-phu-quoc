const crypto = require('crypto');
const {createSessionToken, verifyAdminSession, setSessionCookie, clearSessionCookie} = require('../lib/admin-auth');

const redisUrl = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const scope = process.env.VERCEL_ENV === 'production' ? 'production' : 'preview';
const pinKey = `diemchau:admin-login-pin:${scope}:v1`;
const pinAttemptLimit = 5;
const pinAttemptWindow = 15 * 60;

async function command(parts) {
  const response = await fetch(redisUrl(), {method:'POST',headers:{'Authorization':`Bearer ${redisToken()}`,'Content-Type':'application/json'},body:JSON.stringify(parts)});
  if (!response.ok) throw new Error('Redis HTTP error');
  const json = await response.json();
  if (json.error) throw new Error('Redis command error');
  return json.result;
}

const fail = (res, status, message) => res.status(status).json({success:false,message});
const sameSecret = (candidate, secret) => {
  const a = Buffer.from(candidate || ''); const b = Buffer.from(secret || '');
  return !!secret && a.length === b.length && crypto.timingSafeEqual(a,b);
};
const ipHash = (req) => crypto.createHash('sha256').update(String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()).digest('hex').slice(0,24);

async function getCurrentPin() {
  const stored = await command(['GET',pinKey]);
  if (!stored) return {plain: process.env.ADMIN_LOGIN_PIN || ''};
  try { return {hash: JSON.parse(stored)}; } catch { throw new Error('Invalid stored admin PIN'); }
}

async function pinMatches(candidate) {
  const current = await getCurrentPin();
  if (current.plain) return sameSecret(candidate,current.plain);
  const stored = current.hash;
  if (!stored || !stored.salt || !stored.hash) return false;
  const actual = crypto.scryptSync(candidate,stored.salt,32);
  const expected = Buffer.from(stored.hash,'hex');
  return actual.length === expected.length && crypto.timingSafeEqual(actual,expected);
}

module.exports = async (req,res) => {
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Vary','Cookie');
  if (!redisUrl() || !redisToken() || (process.env.ADMIN_SESSION_SECRET || '').length < 64) return fail(res,503,'Đăng nhập quản trị chưa được cấu hình.');

  if (req.method === 'GET') {
    if (!verifyAdminSession(req)) return fail(res,401,'Phiên quản trị đã hết hạn.');
    return res.status(200).json({success:true,authenticated:true});
  }

  if (req.method === 'DELETE') {
    clearSessionCookie(res);
    return res.status(200).json({success:true});
  }

  if (req.method === 'PUT') {
    if (!verifyAdminSession(req)) return fail(res,401,'Cần đăng nhập để đổi mã PIN.');
    const body = typeof req.body === 'string' ? (()=>{try{return JSON.parse(req.body)}catch{return {}}})() : (req.body || {});
    const newPin = String(body.newPin || '');
    if (!/^\d{6}$/.test(newPin)) return fail(res,400,'Mã PIN mới cần có đúng 6 chữ số.');
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(newPin,salt,32).toString('hex');
    try {
      await command(['SET',pinKey,JSON.stringify({salt,hash})]);
      return res.status(200).json({success:true});
    } catch { return fail(res,503,'Chưa lưu được mã PIN mới.'); }
  }

  if (req.method !== 'POST') return fail(res,405,'Phương thức không được hỗ trợ.');
  const body = typeof req.body === 'string' ? (()=>{try{return JSON.parse(req.body)}catch{return {}}})() : (req.body || {});
  const pin = String(body.pin || '');
  if (!/^\d{6}$/.test(pin)) return fail(res,400,'Mã PIN cần có đúng 6 chữ số.');
  const attemptKey = `diemchau:admin-login-attempt:${scope}:${ipHash(req)}`;
  try {
    const attempts = Number(await command(['INCR',attemptKey]));
    if (attempts === 1) await command(['EXPIRE',attemptKey,pinAttemptWindow]);
    if (attempts > pinAttemptLimit) return fail(res,429,'Đăng nhập tạm khóa sau nhiều lần thử. Vui lòng thử lại sau 15 phút.');
    if (!await pinMatches(pin)) return fail(res,401,'Mã quản trị không chính xác.');
    await command(['DEL',attemptKey]);
    setSessionCookie(res,createSessionToken());
    return res.status(200).json({success:true,authenticated:true});
  } catch {
    return fail(res,503,'Chưa xác thực được phiên quản trị.');
  }
};
