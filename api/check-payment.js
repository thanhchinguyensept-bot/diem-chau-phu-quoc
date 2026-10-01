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

  if (!amount) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin số tiền (amount)' });
  }

  // SePAY API Token provided by user
  const SEPAY_API_TOKEN = process.env.SEPAY_API_TOKEN || 'M7PITPKYBZR85DDZFFVJ1CR2CZBWH2HVPGOKWNOUBJ3UMD7YLIAWGAUJDQNSHKPN';

  try {
    // Call SePAY API v2 (Official Open API Endpoint)
    const response = await fetch('https://userapi.sepay.vn/v2/transactions?limit=20', {
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
    const transactions = data.data || data.messages || data.transactions || [];

    const expectedAmount = parseInt(amount, 10);
    const cleanMemo = (memo || '').toString().replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const cleanPhone = (phone || '').toString().replace(/[^0-9]/g, '');
    const phoneTail = cleanPhone.length >= 4 ? cleanPhone.slice(-4) : '';
    const roomStr = (room || '').toString().replace(/[^0-9]/g, '');

    // Smart Match: Tìm giao dịch khớp số tiền và nội dung chuyển khoản linh hoạt
    const matched = transactions.find(tx => {
      // Chỉ kiểm tra giao dịch tiền vào (transfer_type == 'in' hoặc amount_in > 0)
      const txAmount = parseInt(tx.amount_in || tx.amount || 0, 10);
      if (txAmount <= 0) return false;

      const rawContent = (tx.transaction_content || tx.description || tx.content || '');
      const txContent = rawContent.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

      // 1. Kiểm tra khớp số tiền
      const isAmountMatch = Math.abs(txAmount - expectedAmount) < 1000;
      if (!isAmountMatch) return false;

      // 2. Kiểm tra nếu có khớp memo đầy đủ
      if (cleanMemo && cleanMemo.length >= 6 && txContent.includes(cleanMemo)) {
        return true;
      }

      // 3. Kiểm tra từ khóa thương hiệu DIEMCHAU hoặc DC
      const hasBrand = txContent.includes('DIEMCHAU') || txContent.includes('DC');
      
      // 4. Kiểm tra phòng hoặc số điện thoại
      const hasRoom = roomStr ? (txContent.includes(`P${roomStr}`) || txContent.includes(roomStr)) : false;
      const hasPhone = cleanPhone && cleanPhone.length >= 8 ? txContent.includes(cleanPhone) : (phoneTail ? txContent.includes(phoneTail) : false);

      if (hasBrand && (hasRoom || hasPhone)) {
        return true;
      }

      // 5. Nếu chuyển đúng số tiền và có chữ DIEMCHAU trong nội dung
      if (hasBrand) {
        return true;
      }

      return false;
    });

    if (matched) {
      // Trích xuất số điện thoại và phòng từ nội dung giao dịch nếu có
      const content = matched.transaction_content || matched.description || '';
      const phoneMatch = content.match(/0\d{9}/);
      const roomMatch = content.match(/P(\d{3})/i);

      return res.status(200).json({
        success: true,
        message: 'Tìm thấy giao dịch thanh toán thành công!',
        transaction: {
          id: matched.id,
          amount: matched.amount_in || matched.amount,
          content: content,
          date: matched.transaction_date,
          bankAccount: matched.account_number || matched.bank_account_id,
          detectedPhone: phoneMatch ? phoneMatch[0] : null,
          detectedRoom: roomMatch ? roomMatch[1] : null
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
