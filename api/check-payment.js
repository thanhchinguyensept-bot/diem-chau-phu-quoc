// Safely parse Vietnam timezone string to epoch millisecond
function parseVNTimeToTimestamp(dateStr) {
  if (!dateStr) return 0;
  let s = String(dateStr).trim();
  if (s.includes(' ')) {
    s = s.replace(' ', 'T');
  }
  if (!s.includes('+') && !s.includes('Z')) {
    s += '+07:00';
  }
  const t = new Date(s).getTime();
  return isNaN(t) ? 0 : t;
}

// Vercel Serverless Function: Check SePAY Transactions Real-Time (API v2)
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const amount = req.query.amount || (req.body && req.body.amount);
  const memo = req.query.memo || (req.body && req.body.memo);
  const room = req.query.room || (req.body && req.body.room);
  const phone = req.query.phone || (req.body && req.body.phone);
  const after = req.query.after || (req.body && req.body.after);
  const excludeIds = req.query.exclude || (req.body && req.body.exclude);

  if (!amount) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin số tiền (amount)' });
  }

  const cleanPhone = (phone || '').toString().replace(/[^0-9]/g, '');
  if (!cleanPhone || cleanPhone.length < 10) {
    return res.status(200).json({ 
      success: false, 
      message: 'Vui lòng nhập số điện thoại hợp lệ để hệ thống đối soát giao dịch SePAY' 
    });
  }

  // SePAY API Token provided by user
  const SEPAY_API_TOKEN = process.env.SEPAY_API_TOKEN || 'M7PITPKYBZR85DDZFFVJ1CR2CZBWH2HVPGOKWNOUBJ3UMD7YLIAWGAUJDQNSHKPN';

  try {
    // Call SePAY API v2 (Official Open API Endpoint)
    const response = await fetch('https://userapi.sepay.vn/v2/transactions?limit=25', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SEPAY_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ 
        success: false, 
        message: 'Lỗi kết nối tới SePAY API v2', 
        detail: errText 
      });
    }

    const data = await response.json();
    let transactions = [];
    if (Array.isArray(data)) {
      transactions = data;
    } else if (data && Array.isArray(data.data)) {
      transactions = data.data;
    } else if (data && Array.isArray(data.transactions)) {
      transactions = data.transactions;
    } else if (data && Array.isArray(data.messages)) {
      transactions = data.messages;
    } else {
      return res.status(200).json({
        success: false,
        message: 'Định dạng dữ liệu SePAY không chứa mảng giao dịch',
        rawResponse: data
      });
    }

    const expectedAmount = parseInt(amount, 10);
    const cleanMemo = (memo || '').toString().replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const phoneTail = cleanPhone.slice(-4);
    const roomStr = (room || '').toString().replace(/[^0-9]/g, '');

    // List of claimed or excluded transaction IDs
    let excludedList = [];
    try {
      const fs = require('fs');
      if (fs.existsSync('/tmp/admin_room_overrides.json')) {
        const ov = JSON.parse(fs.readFileSync('/tmp/admin_room_overrides.json', 'utf8'));
        if (Array.isArray(ov.clearedTxs)) excludedList.push(...ov.clearedTxs);
      }
    } catch(e) {}
    if (excludeIds) {
      excludedList.push(...String(excludeIds).split(','));
    }

    // Smart Match: Tìm giao dịch khớp số tiền VÀ thông tin đặt phòng
    const matched = transactions.find(tx => {
      // Bỏ qua giao dịch đã dùng hoặc bị loại trừ
      const txIdStr = String(tx.id);
      if (excludedList.map(String).includes(txIdStr)) return false;

      // Chỉ kiểm tra giao dịch tiền vào
      const txAmount = parseInt(tx.amount_in || tx.amount || 0, 10);
      if (txAmount <= 0) return false;

      // 1. Kiểm tra khớp số tiền
      const isAmountMatch = Math.abs(txAmount - expectedAmount) < 1000;
      if (!isAmountMatch) return false;

      // 2. Kiểm tra mốc thời gian: Giao dịch phải phát sinh sau thời điểm khách tạo phiên (Giờ VN UTC+7)
      if (after && tx.transaction_date) {
        const txTime = parseVNTimeToTimestamp(tx.transaction_date);
        const minTime = parseVNTimeToTimestamp(after);
        // Bắt buộc giao dịch phải mới hơn mốc khách vào phiên (dung sai tối đa 15s)
        if (txTime < minTime - 15000) {
          return false;
        }
      }

      const rawContent = (tx.transaction_content || tx.description || tx.content || '');
      const txContent = rawContent.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

      // 3. Khớp chính xác memo đầy đủ nếu có
      if (cleanMemo && cleanMemo.length >= 8 && txContent.includes(cleanMemo)) {
        return true;
      }

      // 4. Kiểm tra từ khóa thương hiệu DIEMCHAU hoặc DC
      const hasBrand = txContent.includes('DIEMCHAU') || txContent.includes('DC');
      if (!hasBrand) return false;
      
      // 5. Bắt buộc phải khớp đồng thời CẢ Phòng VÀ Số điện thoại
      const hasRoom = roomStr ? (txContent.includes(`P${roomStr}`) || txContent.includes(`PHONG${roomStr}`) || txContent.includes(roomStr)) : false;
      const hasPhone = txContent.includes(cleanPhone) || txContent.includes(phoneTail);

      return hasRoom && hasPhone;
    });

    if (matched) {
      // Trích xuất số điện thoại và phòng từ nội dung giao dịch nếu có
      const content = matched.transaction_content || matched.description || '';
      const phoneMatch = content.match(/0\d{9}/);
      const roomMatch = content.match(/P(\d{3})/i) || content.match(/PHONG(\d{3})/i) || content.match(/(101|102|103|104)/);
      const finalRoom = (roomMatch ? roomMatch[1] : null) || roomStr || '104';

      const DEFAULT_PINS = { '101': '7633', '102': '8192', '103': '3321', '104': '4529' };
      let officialPin = DEFAULT_PINS[finalRoom] || '7633';

      // Tự động ghi nhớ ID giao dịch đã khớp và cập nhật phòng sang occupied
      try {
        const fs = require('fs');
        let ov = {};
        if (fs.existsSync('/tmp/admin_room_overrides.json')) {
          ov = JSON.parse(fs.readFileSync('/tmp/admin_room_overrides.json', 'utf8'));
        }
        ov.claimedTxs = ov.claimedTxs || [];
        if (!ov.claimedTxs.includes(matched.id)) {
          ov.claimedTxs.push(matched.id);
        }

        // Lấy mã PIN đã cấu hình trong admin nếu có
        if (ov[finalRoom] && ov[finalRoom].pin) {
          officialPin = ov[finalRoom].pin;
        }

        // Đánh dấu phòng Occupied trên server ngay lập tức
        ov[finalRoom] = ov[finalRoom] || {};
        ov[finalRoom].status = 'occupied';
        ov[finalRoom].guest = phoneMatch ? phoneMatch[0] : cleanPhone;
        ov[finalRoom].bookedAt = matched.transaction_date;
        ov[finalRoom].amount = matched.amount_in || matched.amount;
        ov[finalRoom].txId = matched.id;
        ov[finalRoom].pin = officialPin;
        ov[finalRoom].updatedAt = new Date().toISOString();

        fs.writeFileSync('/tmp/admin_room_overrides.json', JSON.stringify(ov), 'utf8');
      } catch(e) {}

      return res.status(200).json({
        success: true,
        message: 'Tìm thấy giao dịch thanh toán thành công!',
        transaction: {
          id: matched.id,
          amount: matched.amount_in || matched.amount,
          content: content,
          date: matched.transaction_date,
          bankAccount: matched.account_number || matched.bank_account_id,
          detectedPhone: phoneMatch ? phoneMatch[0] : cleanPhone,
          detectedRoom: finalRoom,
          pin: officialPin
        }
      });
    } else {
      return res.status(200).json({
        success: false,
        message: 'Chưa tìm thấy giao dịch khớp (Đang tiếp tục chờ biến động số dư...)',
        checkedCount: transactions.length,
        expectedAmount: expectedAmount,
        lastTransactionDate: transactions[0] ? transactions[0].transaction_date : null
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Lỗi server xử lý SePAY', 
      error: error.message 
    });
  }
};
