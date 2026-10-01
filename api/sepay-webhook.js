// Vercel Serverless Function: SePAY Webhook Receiver
module.exports = async (req, res) => {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Health check for browser or ping
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'Cổng SePAY Webhook Nhà Nghỉ Diễm Châu đang hoạt động sẵn sàng nhận tín hiệu.',
      endpoint: '/api/sepay-webhook',
      timestamp: new Date().toISOString()
    });
  }

  // SePAY Webhooks are sent via POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Chỉ chấp nhận phương thức POST từ SePAY' });
  }

  try {
    const data = req.body || {};
    console.log('--- SEPAY WEBHOOK NOTIFICATION RECEIVED ---', JSON.stringify(data));

    const transactionId = data.id;
    const gateway = data.gateway || 'TPBank';
    const accountNumber = data.accountNumber;
    const content = data.content || data.description || '';
    const transferType = data.transferType; // 'in' (tiền vào) hoặc 'out' (tiền ra)
    const amount = data.transferAmount || data.amount || 0;
    const transactionDate = data.transactionDate;

    // Xác nhận tiền vào tài khoản
    if (transferType === 'in' || amount > 0) {
      console.log(`[SePAY Webhook] Nhận +${amount} VNĐ vào TK ${accountNumber}. Nội dung: "${content}"`);

      // Trả lời mã 200 OK để SePAY xác nhận giao dịch thành công
      return res.status(200).json({
        success: true,
        message: 'Đã nhận và xác nhận biến động số dư thành công từ SePAY',
        receipt: {
          transactionId,
          gateway,
          amount,
          content,
          date: transactionDate
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Bỏ qua giao dịch (không phải tiền vào tài khoản)'
    });
  } catch (error) {
    console.error('Lỗi xử lý SePAY Webhook:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi xử lý dữ liệu Webhook',
      error: error.message
    });
  }
};
