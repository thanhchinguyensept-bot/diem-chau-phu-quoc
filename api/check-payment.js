// Vercel Serverless Function: Check SePAY Transactions Real-Time
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

  if (!amount) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin số tiền (amount)' });
  }

  // SePAY API Token provided by user
  const SEPAY_API_TOKEN = process.env.SEPAY_API_TOKEN || 'M7PITPKYBZR85DDZFFVJ1CR2CZBWH2HVPGOKWNOUBJ3UMD7YLIAWGAUJDQNSHKPN';

  try {
    const response = await fetch('https://my.sepay.vn/userapi/transactions/list?limit=25', {
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
        message: 'Lỗi kết nối tới SePAY API', 
        detail: errText 
      });
    }

    const data = await response.json();
    const transactions = data.messages || data.transactions || [];

    const expectedAmount = parseInt(amount, 10);
    // Chuẩn hóa chuỗi memo: bỏ dấu cách, ký tự đặc biệt, chuyển chữ hoa
    const cleanMemo = (memo || '').toString().replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    // Tìm giao dịch khớp số tiền và nội dung chuyển khoản
    const matched = transactions.find(tx => {
      const txAmount = parseInt(tx.amount_in || tx.amount || 0, 10);
      const rawContent = (tx.transaction_content || tx.description || tx.content || '');
      const txContent = rawContent.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

      // Kiểm tra khớp số tiền
      const isAmountMatch = Math.abs(txAmount - expectedAmount) < 1000;
      
      // Kiểm tra nội dung chuyển khoản
      let isMemoMatch = false;
      if (cleanMemo.length >= 4) {
        isMemoMatch = txContent.includes(cleanMemo);
      } else {
        // Nếu memo ngắn, kiểm tra xem có chứa từ khóa DIEMCHAU hoặc DC không
        isMemoMatch = txContent.includes('DIEMCHAU') || txContent.includes('DC');
      }

      return isAmountMatch && isMemoMatch;
    });

    if (matched) {
      return res.status(200).json({
        success: true,
        message: 'Tìm thấy giao dịch thanh toán thành công!',
        transaction: {
          id: matched.id,
          amount: matched.amount_in || matched.amount,
          content: matched.transaction_content || matched.description,
          date: matched.transaction_date,
          bankAccount: matched.bank_account_id
        }
      });
    } else {
      return res.status(200).json({
        success: false,
        message: 'Chưa tìm thấy giao dịch khớp (Đang tiếp tục chờ khách chuyển tiền...)',
        checkedCount: transactions.length
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
