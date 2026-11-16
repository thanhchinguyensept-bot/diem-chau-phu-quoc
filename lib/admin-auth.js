const crypto = require('crypto');

const COOKIE_NAME = 'dc_admin_session';
const SESSION_SECONDS = 60 * 60;

const getSecret = () => process.env.ADMIN_SESSION_SECRET || '';
const sign = (payload) => crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');

function createSessionToken() {
  const payload = Buffer.from(JSON.stringify({exp: Date.now() + SESSION_SECONDS * 1000, nonce: crypto.randomBytes(12).toString('hex')})).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function verifyAdminSession(req) {
  const secret = getSecret();
  if (secret.length < 64) return false;
  const cookieHeader = String(req.headers.cookie || '');
  const cookie = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!cookie) return false;
  const token = cookie.slice(COOKIE_NAME.length + 1);
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return false;
  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return Number.isFinite(session.exp) && session.exp > Date.now();
  } catch {
    return false;
  }
}

function setSessionCookie(res, token) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${token}; Max-Age=${SESSION_SECONDS}; Path=/; HttpOnly; Secure; SameSite=Strict`);
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict`);
}

module.exports = {COOKIE_NAME, SESSION_SECONDS, createSessionToken, verifyAdminSession, setSessionCookie, clearSessionCookie};
