// Vercel Serverless Function: Global Real-time Rooms State & Sync with SePAY v2
const fs = require('fs');
const path = require('path');

const OVERRIDES_FILE = path.join('/tmp', 'admin_room_overrides.json');

const DEFAULT_ROOMS = {
  101: { name: 'PHÒNG 101 (Deluxe Queen)', short: 'PHÒNG 101', status: 'available', guest: null },
  102: { name: 'PHÒNG 102 (Deluxe Queen)', short: 'PHÒNG 102', status: 'available', guest: null },
  103: { name: 'PHÒNG 103 (VIP King Window)', short: 'PHÒNG 103', status: 'available', guest: null },
  104: { name: 'PHÒNG 104 (Balcony Studio)', short: 'PHÒNG 104', status: 'available', guest: null }
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

  // POST: Admin unlocks or locks a room
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch(e){}
    }
    const roomId = (body && body.roomId) || req.query.roomId;
    const status = (body && body.status) || req.query.status; // 'available', 'locked', 'occupied'

    if (roomId && status) {
      overrides[roomId] = {
        status: status,
        updatedAt: new Date().toISOString()
      };
      // If admin explicitly marked available, also record cleared transaction ID if provided
      if (body && body.clearedTxId) {
        overrides.clearedTxs = overrides.clearedTxs || [];
        overrides.clearedTxs.push(body.clearedTxId);
      }
      writeOverrides(overrides);
      return res.status(200).json({ success: true, message: `Cập nhật phòng ${roomId} thành [${status}]`, overrides });
    }
  }

  // GET: Derive real-time room states from SePAY v2 + Overrides
  const SEPAY_API_TOKEN = process.env.SEPAY_API_TOKEN || 'M7PITPKYBZR85DDZFFVJ1CR2CZBWH2HVPGOKWNOUBJ3UMD7YLIAWGAUJDQNSHKPN';
  const rooms = JSON.parse(JSON.stringify(DEFAULT_ROOMS));

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
      const transactions = Array.isArray(sepayData.data) ? sepayData.data : (Array.isArray(sepayData) ? sepayData : []);
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
            // Check if transaction was within valid period (e.g. today or last 24h)
            const txDate = tx.transaction_date ? new Date(tx.transaction_date) : now;
            const diffHours = (now - txDate) / (1000 * 60 * 60);

            // If transaction is recent (< 24 hours) and not overridden
            if (diffHours < 24) {
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
    if (overrides[id] && overrides[id].status) {
      rooms[id].status = overrides[id].status;
      if (overrides[id].status === 'available') {
        rooms[id].guest = null;
        rooms[id].bookedAt = null;
      }
    }
  });

  return res.status(200).json({
    success: true,
    rooms: rooms,
    serverTime: new Date().toISOString()
  });
};
