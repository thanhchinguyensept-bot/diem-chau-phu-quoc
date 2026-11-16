const crypto = require('crypto');

const redisUrl = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = process.env.VERCEL_ENV === 'production' ? 'diemchau:booking-requests:v2' : 'diemchau:booking-requests:preview:v2';
const prices = {1:80000,2:100000,3:100000,4:140000,5:140000,6:180000};
const RETENTION_MS = 90 * 24 * 60 * 60 * 1000;
const dateOK = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value || '') && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0,10) === value;
const todayVN = () => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(p=>[p.type,p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
};
const timeVN = () => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).map(p=>[p.type,p.value]));
  return `${parts.hour}:${parts.minute}`;
};
const sameSecret = (candidate, secret) => {
  const a = Buffer.from(candidate || ''); const b = Buffer.from(secret || '');
  return !!secret && a.length === b.length && crypto.timingSafeEqual(a,b);
};
async function command(parts) {
  const response = await fetch(redisUrl(), {method:'POST',headers:{'Authorization':`Bearer ${redisToken()}`,'Content-Type':'application/json'},body:JSON.stringify(parts)});
  if (!response.ok) throw new Error('Redis HTTP error');
  const json = await response.json();
  if (json.error) throw new Error('Redis command error');
  return json.result;
}
const fail = (res, status, message) => res.status(status).json({success:false,message});
module.exports = async (req,res) => {
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  if (process.env.BOOKING_REQUESTS_ENABLED !== 'true') return fail(res,503,'Yêu cầu đặt phòng trực tuyến chưa được mở. Vui lòng gọi hoặc nhắn Zalo.');
  if (!redisUrl() || !redisToken()) return fail(res,503,'Hệ thống nhận yêu cầu chưa được cấu hình.');
  if (req.method === 'GET') {
    const key = (req.headers.authorization || '').replace(/^Bearer\s+/i,'');
    const adminSecret = process.env.VERCEL_ENV === 'production' ? process.env.BOOKING_ADMIN_KEY : (process.env.BOOKING_PREVIEW_ADMIN_KEY || process.env.BOOKING_ADMIN_KEY);
    if (!sameSecret(key,adminSecret)) return fail(res,401,'Không có quyền xem yêu cầu.');
    try {
      const cutoff = Date.now() - RETENTION_MS;
      await command(['ZREMRANGEBYSCORE',KEY,'-inf',cutoff]);
      const rows = await command(['ZREVRANGE',KEY,0,199]);
      return res.status(200).json({success:true,requests:(rows || []).map(row => {try{return JSON.parse(row)}catch{return null}}).filter(Boolean)});
    } catch {return fail(res,503,'Chưa đọc được danh sách yêu cầu.');}
  }
  if (req.method !== 'POST') return fail(res,405,'Phương thức không được hỗ trợ.');
  const b = typeof req.body === 'string' ? (()=>{try{return JSON.parse(req.body)}catch{return {}}})() : (req.body || {});
  if (b.website) return fail(res,400,'Thông tin yêu cầu chưa hợp lệ.');
  const name = String(b.name || '').trim(); const phone = String(b.phone || '').replace(/\D/g,'');
  const mode = b.mode; const room = String(b.room || ''); const inDate = String(b.checkInDate || ''); const outDate = String(b.checkOutDate || '');
  const time = String(b.checkInTime || ''); const guests = Number(b.guests); const note = String(b.note || '').trim(); const contactMethod = b.contactMethod;
  const zaloPhone = String(b.zaloPhone || '').replace(/\D/g,'');
  if (name.length<2 || name.length>100 || !/^0\d{9}$/.test(phone) || (zaloPhone && !/^0\d{9}$/.test(zaloPhone)) || !['auto','101','102','103','104'].includes(room) || !['hourly','overnight'].includes(mode) || !Number.isInteger(guests) || guests<1 || guests>4 || !['phone','zalo'].includes(contactMethod) || note.length>500 || !dateOK(inDate) || inDate<todayVN()) return fail(res,400,'Thông tin yêu cầu chưa hợp lệ.');
  let amount, nights=null, hours=null;
  if (mode==='hourly') {
    hours=Number(b.hours);
    if (!Number.isInteger(hours) || !prices[hours] || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time) || (inDate===todayVN() && time<timeVN())) return fail(res,400,'Thời gian nghỉ theo giờ chưa hợp lệ.');
    amount=prices[hours];
  } else {
    nights = Math.round((Date.parse(`${outDate}T00:00:00Z`)-Date.parse(`${inDate}T00:00:00Z`))/86400000);
    if (!dateOK(outDate) || nights<1) return fail(res,400,'Ngày trả phòng chưa hợp lệ.');
    amount=nights*200000;
  }
  try {
    const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
    const hash = crypto.createHash('sha256').update(ip).digest('hex').slice(0,24);
    const rateScope = process.env.VERCEL_ENV === 'production' ? 'production' : 'preview';
    const allowed = await command(['SET',`diemchau:booking-rate:${rateScope}:${hash}`,'1','EX',30,'NX']);
    if (allowed !== 'OK') return fail(res,429,'Vui lòng đợi một chút trước khi gửi yêu cầu tiếp theo.');
    const id = `DC-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const record = {id,createdAt:new Date().toISOString(),status:'pending',name,phone,zaloPhone:zaloPhone||null,contactMethod,guests,note,room,mode,hours,nights,checkInDate:inDate,checkInTime:mode==='hourly'?time:'12:00',checkOutDate:mode==='overnight'?outDate:null,amount};
    const serialized = JSON.stringify(record);
    await command(['ZADD',KEY,Date.now(),serialized]);
    await command(['ZREMRANGEBYSCORE',KEY,'-inf',Date.now()-RETENTION_MS]);
    await command(['ZREMRANGEBYRANK',KEY,0,-501]);
    await command(['EXPIRE',KEY,Math.ceil(RETENTION_MS/1000)]);
    return res.status(201).json({success:true,id});
  } catch {return fail(res,503,'Hệ thống tạm thời chưa nhận được yêu cầu.');}
};
