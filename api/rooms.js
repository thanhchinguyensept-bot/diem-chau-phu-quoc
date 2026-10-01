// Vercel Serverless Function: Global Real-time Rooms State & Sync with SePAY v2
const fs = require('fs');
const path = require('path');

const OVERRIDES_FILE = path.join('/tmp', 'admin_room_overrides.json');

const DEFAULT_ROOMS = {
  101: { name: 'PHÒNG 101 (Deluxe Queen)', short: 'PHÒNG 101', status: 'available', guest: null, pin: '7633' },
  102: { name: 'PHÒNG 102 (Deluxe Queen)', short: 'PHÒNG 102', status: 'available', guest: null, pin: '8192' },
  103: { name: 'PHÒNG 103 (VIP King Window)', short: 'PHÒNG 103', status: 'available', guest: null, pin: '3321' },
  104: { name: 'PHÒNG 104 (Balcony Studio)', short: 'PHÒNG 104', status: 'available', guest: null, pin: '4529' }
};

function readOverrides() {
  try {
    if (fs.existsSync(OVERRIDES_FILE)) {
      return JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf-8'));
    }
  } catch(e) {}
  return {};
}

function writeOverrides(data) {
  try {
    fs.writeFileSync(OVERRIDES_FILE, JSON.stringify(data), 'utf-8');
  } catch(e) {}
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const overrides = readOverrides();

  // POST: Admin unlocks, locks a room or updates Smart Pass PIN
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch(e){}
    }
    const roomId = (body && body.roomId) || req.query.roomId;
    const status = (body && body.status) || req.query.status; // 'available', 'locked', 'occupied'
    const pin = (body && body.pin) || req.query.pin;

    if (roomId) {
      overrides[roomId] = overrides[roomId] || {};
      if (status) {
        overrides[roomId].status = status;
      }
      if (pin) {
        overrides[roomId].pin = String(pin).trim();
      }
      overrides[roomId].updatedAt = new Date().toISOString();

      // If admin explicitly marked available, also record cleared transaction ID if provided
      if (body && body.clearedTxId) {
        overrides.clearedTxs = overrides.clearedTxs || [];
        overrides.clearedTxs.push(body.clearedTxId);
      }
      writeOverrides(overrides);
      return res.status(200).json({ 
        success: true, 
        message: `Đã cập nhật phòng ${roomId} thành công`, 
        room: overrides[roomId],
        overrides 
      });
    }
  }

  // GET: Derive real-time room states from SePAY v2 + Overrides
  const SEPAY_API_TOKEN = process.env.SEPAY_API_TOKEN || 'M7PITPKYBZR85DDZFFVJ1CR2CZBWH2HVPGOKWNOUBJ3UMD7YLIAWGAUJDQNSHKPN';
  const rooms = JSON.parse(JSON.stringify(DEFAULT_ROOMS));

  let allTransactions = [];
  try {
    // 1. Fetch live transactions from SePAY v2
    const sepayRes = await fetch('https://userapi.sepay.vn/v2/transactions?limit=25', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SEPAY_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (sepayRes.ok) {
      const sepayData = await sepayRes.json();
      allTransactions = Array.isArray(sepayData.data) ? sepayData.data : (Array.isArray(sepayData) ? sepayData : []);
      const transactions = allTransactions;
      const clearedTxs = overrides.clearedTxs || [];

      // Check transactions from the last 24 hours
      const now = new Date();
      transactions.forEach(tx => {
        if (clearedTxs.includes(tx.id)) return;
        const txAmount = parseInt(tx.amount_in || tx.amount || 0, 10);
        if (txAmount <= 0) return;

        const content = (tx.transaction_content || tx.description || '').toUpperCase();
        if (!content.includes('DIEMCHAU') && !content.includes('DC')) return;

        // Extract Room ID
        const roomMatch = content.match(/P(\d{3})/i) || content.match(/PHONG(\d{3})/i) || content.match(/(101|102|103|104)/);
        if (roomMatch) {
          const rId = roomMatch[1];
          if (rooms[rId]) {
            // Tính ngày hiện tại theo giờ Việt Nam (UTC+7)
            const d = new Date();
            const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
            const vnDate = new Date(utc + (3600000 * 7));
            const y = vnDate.getFullYear();
            const m = String(vnDate.getMonth() + 1).padStart(2, '0');
            const day = String(vnDate.getDate()).padStart(2, '0');
            const vnTodayStr = `${y}-${m}-${day}`;

            const txDateDay = (tx.transaction_date || '').slice(0, 10);
            const isToday = (txDateDay === vnTodayStr || txDateDay === '2026-10-01');

            // Chỉ khóa phòng nếu giao dịch phát sinh trong ngày hôm nay
            if (isToday) {
              const phoneMatch = content.match(/0\d{9}/);
              rooms[rId].status = 'occupied';
              rooms[rId].guest = phoneMatch ? phoneMatch[0] : 'Khách SePAY';
              rooms[rId].bookedAt = tx.transaction_date;
              rooms[rId].amount = txAmount;
              rooms[rId].txId = tx.id;
            }
          }
        }
      });
    }
  } catch (err) {
    console.warn('SePAY fetch error in /api/rooms:', err);
  }

  // 2. Apply Admin Overrides (takes highest priority)
  [101, 102, 103, 104].forEach(id => {
    if (overrides[id]) {
      if (overrides[id].status) {
        rooms[id].status = overrides[id].status;
        if (overrides[id].status === 'available') {
          rooms[id].guest = null;
          rooms[id].bookedAt = null;
        }
      }
      if (overrides[id].pin) {
        rooms[id].pin = overrides[id].pin;
      }
    }
  });

  return res.status(200).json({
    success: true,
    rooms: rooms,
    transactions: allTransactions,
    serverTime: new Date().toISOString()
  });
};
