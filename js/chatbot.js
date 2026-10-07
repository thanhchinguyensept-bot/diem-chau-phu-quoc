/**
 * js/chatbot.js - Trợ Lý Ảo AI Diễm Châu Phú Quốc (Diem Chau AI Assistant)
 * Chế độ Hybrid:
 * 1. Tri thức nội bộ (Knowledge Base) thông minh, trả lời tức thì 0ms, không phụ thuộc API key.
 * 2. Tích hợp Google Gemini API khi có API Key (lưu trong localStorage), tự động fallback nếu lỗi.
 * 3. Hỗ trợ song ngữ Tiếng Việt (VI) & Tiếng Anh (EN), đồng bộ với js/common.js.
 * 4. Tra cứu trạng thái phòng trực tiếp theo thời gian thực từ localStorage ('diemchau_rooms_state').
 */

(function () {
  'use strict';

  // Khởi tạo trạng thái chatbot
  const STORAGE_KEY_GEMINI = 'diemchau_gemini_api_key';
  const STORAGE_KEY_HISTORY = 'diemchau_chat_history';
  const HOTLINE_NUMBER = '0942 817 633';
  const ZALO_LINK = 'https://zalo.me/0942817633';

  // Dữ liệu tri thức nội bộ chuẩn hóa của Diễm Châu Phú Quốc
  const KNOWLEDGE_BASE = {
    vi: {
      greeting: "Xin chào quý khách! Tôi là **Trợ lý Ảo Diễm Châu Phú Quốc** 🤖. Tôi có thể hỗ trợ quý khách kiểm tra phòng trống, bảng giá, quy trình nhận phòng tự động 100% bằng mã PIN hoặc hỗ trợ đặt phòng. Quý khách cần thông tin gì ạ?",
      placeholder: "Nhập câu hỏi (giá phòng, check-in, vị trí...)...",
      title: "Trợ Lý Ảo Diễm Châu",
      subtitle: "Trực tuyến 24/7 • Check-in Tự Động",
      quick_chips: [
        { label: "💰 Bảng giá phòng", query: "Giá phòng tại Diễm Châu là bao nhiêu?" },
        { label: "🔑 Cách nhận phòng tự động?", query: "Hướng dẫn cách check-in tự động 100% không cần lễ tân?" },
        { label: "🏨 Kiểm tra phòng trống", query: "Hiện tại còn phòng trống nào không?" },
        { label: "📍 Địa chỉ & Đường đi", query: "Địa chỉ nhà nghỉ ở đâu và đi đến như thế nào?" },
        { label: "📶 Tiện nghi phòng", query: "Phòng nghỉ có những tiện nghi gì?" },
        { label: "📞 Hotline hỗ trợ", query: "Số điện thoại hotline hoặc liên hệ khẩn cấp?" }
      ],
      ai_mode_badge_local: "AI Nội Bộ (Tức thì)",
      ai_mode_badge_gemini: "Gemini AI ⚡",
      clear_history_tooltip: "Xóa đoạn chat",
      settings_tooltip: "Cài đặt API Key",
      settings_title: "Cấu hình AI nâng cao (Gemini API)",
      settings_desc: "Nhập Google Gemini API Key để kích hoạt khả năng hội thoại AI mở rộng. Để trống sẽ dùng AI Tri Thức Nội Bộ có sẵn (miễn phí, siêu nhanh).",
      settings_save: "Lưu Cấu Hình",
      settings_close: "Đóng",
      call_action: "Gọi Hotline 24/7",
      book_action: "Đặt Phòng Trực Tuyến",
      bot_typing: "Đang soạn câu trả lời..."
    },
    en: {
      greeting: "Hello and welcome! I am the **Diem Chau AI Assistant** 🤖. I am here 24/7 to assist you with room rates, 100% contactless Smart Pass PIN check-in, real-time availability, and instant bookings. How may I help you today?",
      placeholder: "Ask about rates, check-in, location...",
      title: "Diem Chau AI Assistant",
      subtitle: "Online 24/7 • Smart Self Check-in",
      quick_chips: [
        { label: "💰 Room Rates", query: "What are the room rates?" },
        { label: "🔑 How to Self Check-in?", query: "How does 100% contactless check-in work?" },
        { label: "🏨 Available Rooms", query: "Are there any available rooms right now?" },
        { label: "📍 Location & Directions", query: "Where is the motel located?" },
        { label: "📶 Amenities", query: "What amenities are included in the room?" },
        { label: "📞 Emergency Hotline", query: "What is your emergency contact number?" }
      ],
      ai_mode_badge_local: "Local Knowledge AI",
      ai_mode_badge_gemini: "Gemini AI ⚡",
      clear_history_tooltip: "Clear chat history",
      settings_tooltip: "API Key Settings",
      settings_title: "Advanced AI Settings (Gemini API)",
      settings_desc: "Enter your Google Gemini API Key to enable generative conversation. Leave empty to use Fast Local Knowledge AI (free & zero latency).",
      settings_save: "Save Settings",
      settings_close: "Close",
      call_action: "Call Hotline 24/7",
      book_action: "Book Room Online",
      bot_typing: "Thinking..."
    }
  };

  // Lấy ngôn ngữ hiện tại
  function getCurrentLang() {
    return localStorage.getItem('diemchau_language') || 'vi';
  }

  // Tra cứu trạng thái phòng thực tế từ localStorage
  function getRealtimeRooms() {
    try {
      const stored = localStorage.getItem('diemchau_rooms_state');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading room state:', e);
    }
    // Dữ liệu mặc định nếu chưa khởi tạo
    return {
      101: { status: 'available', type: 'Standard Queen', priceHourly: 80000, priceOvernight: 200000 },
      102: { status: 'occupied', type: 'Deluxe Double', priceHourly: 90000, priceOvernight: 220000 },
      103: { status: 'available', type: 'Standard Queen', priceHourly: 80000, priceOvernight: 200000 },
      104: { status: 'available', type: 'Superior King', priceHourly: 100000, priceOvernight: 250000 },
      105: { status: 'occupied', type: 'Standard Queen', priceHourly: 80000, priceOvernight: 200000 },
      106: { status: 'available', type: 'Deluxe Twin', priceHourly: 95000, priceOvernight: 230000 }
    };
  }

  // Xử lý logic NLP nội bộ thông minh dựa trên từ khóa & ngữ cảnh (Local Smart Rule Engine)
  function answerWithLocalKnowledge(query, lang) {
    const q = query.toLowerCase().trim();
    const isEn = lang === 'en';
    const rooms = getRealtimeRooms();

    // 1. Kiểm tra phòng trống (Availability)
    if (q.includes('còn phòng') || q.includes('trống') || q.includes('available') || q.includes('phòng nào') || q.includes('xem phòng')) {
      const availableRooms = Object.keys(rooms).filter(id => rooms[id].status === 'available');
      if (isEn) {
        if (availableRooms.length > 0) {
          return `✨ **Real-time Room Status:** We currently have **${availableRooms.length} available room(s)**: Room **${availableRooms.join(', ')}**.\n\n• **Standard Room:** Clean, air-conditioned, private bath with hot water.\n• **Nightly Rate:** Only **200.000đ** (12:00 PM to 12:00 PM next day).\n• **Hourly Rate:** From **80.000đ/hour**.\n\n👉 You can select and book directly at our [Booking Page](booking.html)!`;
        } else {
          return `⚠️ All rooms are currently occupied or being UV-sanitized. Please contact our 24/7 hotline at **${HOTLINE_NUMBER}** to check future time slots.`;
        }
      } else {
        if (availableRooms.length > 0) {
          return `✨ **Trạng thái phòng thời gian thực:** Hiện tại Nhà Nghỉ Diễm Châu đang có **${availableRooms.length} phòng trống sẵn sàng đón khách**: Phòng **${availableRooms.join(', ')}**.\n\n• **Tiêu chuẩn:** Phòng sạch sẽ khử khuẩn UV, nệm êm cao cấp, máy lạnh Inverter, nước nóng 24/24.\n• **Giá qua đêm:** Chỉ **200.000đ/đêm** (12h trưa hôm nay đến 12h trưa hôm sau).\n• **Giá theo giờ:** Chỉ từ **80.000đ/giờ**.\n\n👉 Quý khách có thể bấm [Đặt Phòng Trực Tuyến](booking.html) để chọn phòng và nhận mã mở cửa ngay!`;
        } else {
          return `⚠️ Hiện tại các phòng đang kín hoặc đang trong ca khử khuẩn UV. Quý khách vui lòng gọi Hotline **${HOTLINE_NUMBER}** để kiểm tra khung giờ sắp trả phòng nhé!`;
        }
      }
    }

    // 2. Bảng giá phòng (Rates & Pricing)
    if (q.includes('giá') || q.includes('bao nhiêu') || q.includes('rate') || q.includes('price') || q.includes('cost') || q.includes('tiền') || q.includes('chi phí')) {
      if (isEn) {
        return `💵 **Official Room Rates at Diem Chau Phu Quoc:**\n\n1. **Overnight Package (Best Value):** **200.000 VNĐ / night**\n   - Check-in: 12:00 PM today\n   - Check-out: 12:00 PM next day (Full 24 hours)\n\n2. **Flexible Hourly Package:**\n   - 1st hour: **80.000 VNĐ**\n   - 2nd hour: **110.000 VNĐ**\n   - 3rd hour: **140.000 VNĐ** (Add 30k each next hour)\n\n📌 *Prices include high-speed WiFi, complimentary bottled water, toiletries, and 100% automated PIN access.*`;
      } else {
        return `💵 **Bảng Giá Niêm Yết Nhà Nghỉ Diễm Châu Phú Quốc:**\n\n1. **Gói Thuê Qua Đêm (24 Giờ trọn vẹn):** **200.000đ / đêm**\n   - Nhận phòng: 12:00 trưa hôm nay\n   - Trả phòng: 12:00 trưa hôm sau (Kỳ nghỉ trọn vẹn 24 tiếng)\n\n2. **Gói Thuê Linh Hoạt Theo Giờ:**\n   - Giờ đầu: **80.000đ**\n   - 2 giờ: **110.000đ**\n   - 3 giờ: **140.000đ** (Các giờ tiếp theo +30.000đ/giờ)\n\n📌 *Giá đã bao gồm: Khử khuẩn UV, máy lạnh, nước nóng, Wifi 6, nước suối và đồ vệ sinh cá nhân miễn phí.*`;
      }
    }

    // 3. Quy trình check-in tự động / Mã PIN / Smart Pass
    if (q.includes('check-in') || q.includes('check in') || q.includes('nhận phòng') || q.includes('mã pin') || q.includes('mã số') || q.includes('smart pass') || q.includes('không lễ tân') || q.includes('tự động') || q.includes('mở cửa') || q.includes('khóa')) {
      if (isEn) {
        return `🔑 **100% Automated Keyless Check-in Guide:**\n\n1. **Select Room & Pay:** Choose your room on the [Booking Page](booking.html) and scan the VietQR code.\n2. **Receive Smart Pass Instantly:** Once payment is verified (via automated SePAY within 3 seconds), system generates a **4-digit PIN code**.\n3. **Unlock Your Door:** Arrive at your room door, touch the digital door keypad to wake it up, enter your **4-digit PIN** followed by the **#** key.\n4. **Enjoy Absolute Privacy:** 100% contactless, no waiting at the front desk!\n\n📞 Emergency door assistance: **${HOTLINE_NUMBER}** (24/7).`;
      } else {
        return `🔑 **Quy Trình Nhận Phòng Tự Động 100% Không Cần Lễ Tân:**\n\n1. **Đặt phòng & Quét VietQR:** Chọn phòng và thời gian tại trang [Đặt Phòng](booking.html). Quét mã VietQR chuyển khoản chính xác nội dung.\n2. **Nhận Smart Pass tức thì:** Cổng SePAY tự động xác nhận trong 3 giây và cấp thẻ **Smart Pass** chứa **mã PIN 4 số** riêng biệt của phòng bạn.\n3. **Mở cửa phòng:** Đến trước cửa phòng, chạm nhẹ tay vào màn hình khóa số cho sáng đèn, bấm **4 số PIN** và kết thúc bằng phím **#**.\n4. **Riêng tư tuyệt đối:** Không mất thời gian chờ đợi lễ tân, nhận phòng bất kỳ lúc nào 24/7!\n\n📞 Hỗ trợ mở cửa khẩn cấp: **${HOTLINE_NUMBER}** (24/7).`;
      }
    }

    // 4. Vị trí / Địa chỉ / Đường đi (Location)
    if (q.includes('ở đâu') || q.includes('địa chỉ') || q.includes('vị trí') || q.includes('đường') || q.includes('location') || q.includes('where') || q.includes('address') || q.includes('bản đồ') || q.includes('map')) {
      if (isEn) {
        return `📍 **Location & Directions:**\n\n• **Address:** Cach Mang Thang Tam Street, Duong Dong Ward, Phu Quoc City, Kien Giang Province.\n• **Highlights:** Located in the central Duong Dong area, peaceful, secure, near local seafood eateries, coffee shops, and only a 5-7 minute ride to Phu Quoc Night Market and Dinh Cau Beach.\n• **Google Maps:** You can view the route or ask our 24/7 hotline **${HOTLINE_NUMBER}** for pinpoint navigation guidance.`;
      } else {
        return `📍 **Địa Chỉ & Chỉ Đường Đến Diễm Châu:**\n\n• **Địa chỉ:** Đường Cách Mạng Tháng Tám, Phường Dương Đông, TP. Phú Quốc, Kiên Giang.\n• **Vị trí thuận lợi:** Nằm tại trung tâm Dương Đông, khu vực an ninh, yên tĩnh, gần chợ đêm Phú Quốc, Dinh Cậu (chỉ 5-7 phút đi xe máy), thuận tiện ăn uống hải sản và cà phê.\n• **Bãi đỗ xe:** Có sân rộng rãi, an toàn cho cả xe máy và ô tô.\n• Quý khách có thể xem bản đồ tại trang [Liên Hệ](contact.html) hoặc gọi **${HOTLINE_NUMBER}** để được hướng dẫn đường đi chi tiết!`;
      }
    }

    // 5. Tiện nghi phòng (Amenities)
    if (q.includes('tiện nghi') || q.includes('tiện ích') || q.includes('wifi') || q.includes('máy lạnh') || q.includes('nước nóng') || q.includes('amenities') || q.includes('dịch vụ') || q.includes('tủ lạnh') || q.includes('tivi')) {
      if (isEn) {
        return `🛋️ **Room Amenities Included:**\n\n• High-speed **WiFi 6** in every room.\n• Quiet & cool **Inverter Air Conditioning**.\n• 24/7 hot shower bathroom.\n• UV sterilization standard before every guest check-in.\n• Complimentary bottled spring water, toothbrush, shampoo & shower gel.\n• Smart lock PIN pad on each door.\n• Free secure parking for motorbikes and cars.`;
      } else {
        return `🛋️ **Tiện Nghi Đầy Đủ Trong Mỗi Phòng:**\n\n• Máy lạnh **Inverter** êm ái, mát lạnh sâu.\n• Phòng tắm riêng biệt, bình **nước nóng 24/24**.\n• **WiFi 6** tốc độ cao riêng cho từng phòng.\n• Tiêu chuẩn khử trùng bằng đèn **UV và cồn y tế** trước khi giao phòng.\n• Miễn phí nước suối đóng chai, bàn chải, dầu gội, sữa tắm và khăn sạch.\n• Khóa từ số PIN thông minh riêng tư tuyệt đối.\n• Bãi đậu xe rộng rãi, có camera an ninh 24/7.`;
      }
    }

    // 6. Hotline / Liên hệ / Zalo (Contact / Hotline)
    if (q.includes('liên hệ') || q.includes('hotline') || q.includes('số điện thoại') || q.includes('sđt') || q.includes('phone') || q.includes('contact') || q.includes('zalo') || q.includes('chủ nhà')) {
      if (isEn) {
        return `📞 **24/7 Customer Support & Assistance:**\n\n• **Hotline / Zalo:** **${HOTLINE_NUMBER}**\n• **Availability:** 24 hours / 7 days a week.\n• Feel free to call us anytime if you need help with navigation, door PIN unlock, or payment confirmation!`;
      } else {
        return `📞 **Thông Tin Liên Hệ & Hỗ Trợ 24/7:**\n\n• **Hotline / Zalo:** **${HOTLINE_NUMBER}**\n• **Thời gian hỗ trợ:** 24/7 bất kể ngày đêm.\n• Đội ngũ kỹ thuật và chủ quản luôn sẵn sàng hỗ trợ quý khách về đường đi, mở cửa phòng khẩn cấp hoặc hỗ trợ thanh toán. Quý khách có thể gọi trực tiếp hoặc nhắn tin Zalo số trên nhé!`;
      }
    }

    // 7. Đặt phòng (Booking instructions)
    if (q.includes('đặt phòng') || q.includes('book') || q.includes('thuê') || q.includes('thủ tục')) {
      if (isEn) {
        return `✨ **How to Book a Room Online:**\n\n1. Visit our [Booking Page](booking.html).\n2. Select your stay type (Hourly or Overnight) and check-in date/time.\n3. Choose your preferred available room.\n4. Enter your phone number and scan the VietQR to pay.\n5. Your **Smart Pass PIN** is generated immediately on screen!\n\n👉 Click here to [Book Now](booking.html).`;
      } else {
        return `✨ **Hướng Dẫn Đặt Phòng Nhanh:**\n\n1. Truy cập trang [Đặt Phòng](booking.html).\n2. Chọn hình thức (Theo Giờ hoặc Qua Đêm) cùng khung giờ bạn muốn đến.\n3. Chọn phòng trống ưng ý trên sơ đồ.\n4. Nhập số điện thoại nhận mã và quét mã VietQR thanh toán.\n5. Mã PIN Smart Pass sẽ hiển thị ngay trên màn hình để bạn mở cửa!\n\n👉 Bấm vào đây để [Đặt Phòng Ngay](booking.html).`;
      }
    }

    // 8. Chế độ trả lời mặc định thân thiện
    if (isEn) {
      return `Cảm ơn quý khách đã hỏi! Tại Nhà Nghỉ Diễm Châu Phú Quốc:\n\n• Giá phòng chỉ từ **80.000đ/giờ** hoặc **200.000đ/đêm** (12h - 12h).\n• Nhận phòng 100% tự động qua **Smart Pass (Mã PIN 4 số)**.\n• Địa chỉ: Đường Cách Mạng Tháng Tám, P. Dương Đông, Phú Quốc.\n• Hotline khẩn cấp 24/7: **${HOTLINE_NUMBER}**.\n\nQuý khách muốn biết thêm thông tin cụ thể nào hoặc muốn [Đặt phòng ngay](booking.html) không ạ?`;
    } else {
      return `Cảm ơn quý khách đã gửi tin nhắn! Tại Nhà Nghỉ Diễm Châu Phú Quốc:\n\n• **Bảng giá:** Chỉ từ **80.000đ/giờ** hoặc **200.000đ/đêm** (12h - 12h hôm sau).\n• **Nhận phòng:** 100% tự động qua mã PIN bảo mật, không lễ tân, riêng tư tuyệt đối.\n• **Địa chỉ:** Đường Cách Mạng Tháng Tám, Dương Đông, Phú Quốc.\n• **Hotline / Zalo:** **${HOTLINE_NUMBER}** (Phục vụ 24/7).\n\nQuý khách có thể nhấn vào các gợi ý bên dưới hoặc bấm [Đặt Phòng Ngay](booking.html) nhé!`;
    }
  }

  // Gọi Google Gemini API nếu có API Key
  async function answerWithGeminiAPI(apiKey, query, lang, chatHistory) {
    const isEn = lang === 'en';
    const rooms = getRealtimeRooms();
    const availableRooms = Object.keys(rooms).filter(id => rooms[id].status === 'available');

    const systemPrompt = `Bạn là Trợ Lý Ảo AI chuyên nghiệp, niềm nở và chu đáo của "Nhà Nghỉ Diễm Châu Phú Quốc" (Diem Chau Motel Phu Quoc).
Thông tin chính thống của nhà nghỉ:
- Tinh thần: Riêng tư tuyệt đối, sạch sẽ, giá bình dân, tự động hóa 100%.
- Giá phòng: Thuê qua đêm trọn gói 200.000đ/đêm (Check-in 12:00 trưa hôm nay đến Check-out 12:00 trưa hôm sau). Thuê theo giờ: 80.000đ giờ đầu, thêm giờ tiếp theo chỉ 30.000đ/giờ.
- Trạng thái phòng hiện tại: Các phòng đang trống có thể đặt là: ${availableRooms.join(', ')}.
- Check-in tự động 100%: Khách đặt phòng trên website booking.html, thanh toán VietQR tự động qua SePAY, hệ thống cấp thẻ Smart Pass có chứa mã PIN 4 số của phòng. Khách đến cửa chỉ cần chạm màn hình khóa số điện tử, gõ 4 số PIN và bấm phím # để vào phòng. Không tiếp xúc lễ tân, nhận phòng 24/7.
- Địa chỉ: Đường Cách Mạng Tháng Tám, Phường Dương Đông, TP. Phú Quốc. Rất gần trung tâm, Dinh Cậu, chợ đêm.
- Hotline / Zalo hỗ trợ 24/7: 0942 817 633.
- Tiện nghi: Máy lạnh Inverter, nước nóng 24/24, Wifi 6 miễn phí, nước suối miễn phí, khăn tắm, bàn chải, khử trùng tia cực tím UV.
Hãy trả lời khách bằng ngôn ngữ: ${isEn ? 'English' : 'Tiếng Việt'}. Ngắn gọn, súc tích, định dạng markdown đẹp mắt (in đậm, danh sách), và luôn hướng khách đặt phòng hoặc gọi hotline khi cần.`;

    const contents = [];
    // Thêm lịch sử hội thoại gần nhất (tối đa 4 lượt)
    const recent = chatHistory.slice(-4);
    recent.forEach(msg => {
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    });
    // Thêm câu hỏi hiện tại
    contents.push({
      role: 'user',
      parts: [{ text: query }]
    });

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600
        }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text;
    }
    throw new Error('No candidate returned from Gemini API');
  }

  // Parse markdown đơn giản sang HTML an toàn
  function formatMarkdown(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // In đậm **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // In nghiêng *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Link [text](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="underline font-semibold text-secondary hover:text-accent-hover" target="_self">$1</a>');
    // Đổi dấu xuống dòng thành <br>
    html = html.replace(/\n\n/g, '</p><p class="mt-2">');
    html = html.replace(/\n/g, '<br/>');

    return `<p>${html}</p>`;
  }

  // Lớp điều khiển giao diện Chatbot Widget
  class DiemChauChatbot {
    constructor() {
      this.isOpen = false;
      this.isTyping = false;
      this.currentLang = getCurrentLang();
      this.geminiApiKey = localStorage.getItem(STORAGE_KEY_GEMINI) || '';
      this.history = this.loadHistory();
      this.initUI();
      this.bindEvents();
    }

    loadHistory() {
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY_HISTORY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error('Error loading history:', e);
      }
      return [];
    }

    saveHistory() {
      try {
        sessionStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(this.history));
      } catch (e) {
        console.error('Error saving history:', e);
      }
    }

    initUI() {
      // Tránh duplicate nếu script được gọi 2 lần
      if (document.getElementById('diemchau-chatbot-container')) return;

      const container = document.createElement('div');
      container.id = 'diemchau-chatbot-container';
      container.className = 'fixed bottom-5 right-5 z-[99] font-sans select-none';

      container.innerHTML = `
        <!-- BONG BÓNG GỢI Ý CHÀO HỎI (Tooltip Badge) -->
        <div id="chatbot-teaser" class="hidden absolute bottom-16 right-0 mb-3 bg-surface-container-lowest text-on-surface px-4 py-3 rounded-2xl shadow-xl border border-secondary-container/40 max-w-xs transition-all duration-300 transform origin-bottom-right">
          <button id="chatbot-teaser-close" class="absolute -top-2 -left-2 w-5 h-5 bg-outline-variant hover:bg-status-danger text-white rounded-full flex items-center justify-center text-[10px] shadow transition-colors">✕</button>
          <div class="flex items-start gap-2.5">
            <span class="text-xl">👋</span>
            <div class="text-xs">
              <strong class="text-primary block font-semibold mb-0.5">Diễm Châu AI 24/7</strong>
              <span id="chatbot-teaser-text" class="text-text-muted leading-relaxed">Cần xem giá phòng hoặc hướng dẫn nhận phòng tự động không ạ? Nhắn em nhé!</span>
            </div>
          </div>
        </div>

        <!-- NÚT FLOATING TRIGGER (Bong bóng chat) -->
        <button id="chatbot-toggle-btn" type="button" aria-label="Mở Trợ lý ảo AI" class="w-14 h-14 rounded-full bg-primary text-secondary-container hover:bg-primary-container hover:scale-105 active:scale-95 shadow-[0_8px_24px_rgba(1,36,53,0.35)] flex items-center justify-center transition-all duration-300 relative group cursor-pointer border border-secondary-container/30">
          <span class="material-symbols-outlined text-[28px] transition-transform duration-300 group-hover:rotate-12" id="chatbot-icon-open">smart_toy</span>
          <span class="material-symbols-outlined text-[28px] hidden" id="chatbot-icon-close">close</span>
          <!-- Chấm xanh Online Pulse -->
          <span class="absolute top-1 right-1 w-3.5 h-3.5 bg-[#10B981] border-2 border-primary rounded-full">
            <span class="absolute inset-0 rounded-full bg-[#10B981] animate-ping opacity-75"></span>
          </span>
        </button>

        <!-- CỬA SỔ HỘP THOẠI CHATBOT -->
        <div id="chatbot-window" class="hidden fixed sm:absolute bottom-0 right-0 sm:bottom-16 sm:right-0 w-full sm:w-[390px] h-[92vh] sm:h-[560px] max-h-[640px] bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl shadow-2xl border border-outline-variant/40 flex-col overflow-hidden transition-all duration-300 z-[100]">
          
          <!-- HEADER -->
          <div class="bg-primary text-on-primary px-4 py-3.5 flex items-center justify-between border-b border-secondary-container/20">
            <div class="flex items-center gap-3">
              <div class="relative w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-secondary-container border border-secondary-container/40">
                <span class="material-symbols-outlined text-[20px]">smart_toy</span>
                <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] border border-primary"></span>
              </div>
              <div class="flex flex-col">
                <div class="flex items-center gap-1.5">
                  <span id="chatbot-header-title" class="font-bold text-sm tracking-wide text-on-primary">Trợ Lý Ảo Diễm Châu</span>
                  <span id="chatbot-mode-badge" class="text-[9px] px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-semibold uppercase">AI</span>
                </div>
                <span id="chatbot-header-subtitle" class="text-[11px] text-on-primary-container flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                  Trực tuyến 24/7 • Tự Động 100%
                </span>
              </div>
            </div>

            <!-- Các nút công cụ Header -->
            <div class="flex items-center gap-1 text-on-primary-container">
              <button id="chatbot-btn-settings" type="button" title="Cài đặt API Key" class="w-8 h-8 rounded-lg hover:bg-white/10 hover:text-secondary-container flex items-center justify-center transition-colors">
                <span class="material-symbols-outlined text-[18px]">tune</span>
              </button>
              <button id="chatbot-btn-clear" type="button" title="Xóa lịch sử chat" class="w-8 h-8 rounded-lg hover:bg-white/10 hover:text-status-danger flex items-center justify-center transition-colors">
                <span class="material-symbols-outlined text-[18px]">delete_sweep</span>
              </button>
              <button id="chatbot-btn-close-window" type="button" title="Thu nhỏ chat" class="w-8 h-8 rounded-lg hover:bg-white/10 hover:text-on-primary flex items-center justify-center transition-colors">
                <span class="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
              </button>
            </div>
          </div>

          <!-- BANNER PHÍM TẮT ĐẶT PHÒNG & HOTLINE NHANH -->
          <div class="bg-primary-container/40 px-3 py-1.5 flex items-center justify-between text-xs border-b border-outline-variant/20">
            <a href="booking.html" class="inline-flex items-center gap-1 text-secondary-container hover:text-accent-hover font-semibold transition-colors">
              <span class="material-symbols-outlined text-[14px]">calendar_month</span>
              <span id="chatbot-quick-book">Đặt Phòng Online</span>
            </a>
            <a href="tel:0942817633" class="inline-flex items-center gap-1 text-on-primary hover:text-secondary-container transition-colors">
              <span class="material-symbols-outlined text-[14px] text-secondary-container">call</span>
              <span>0942 817 633</span>
            </a>
          </div>

          <!-- MODAL CÀI ĐẶT GEMINI API KEY (ẨN MẶC ĐỊNH) -->
          <div id="chatbot-settings-panel" class="hidden bg-surface-container p-4 border-b border-outline-variant/30 text-xs">
            <div class="flex items-center justify-between mb-2">
              <strong id="chatbot-settings-title" class="text-primary font-bold">Cấu hình Google Gemini AI</strong>
              <button id="chatbot-settings-close-btn" class="text-text-muted hover:text-primary">✕</button>
            </div>
            <p id="chatbot-settings-desc" class="text-text-muted mb-2 leading-relaxed">
              Nhập API Key để kích hoạt AI đàm thoại tự do. Để trống sẽ dùng AI Nội Bộ cực nhanh & miễn phí.
            </p>
            <input type="password" id="chatbot-api-key-input" placeholder="Dán Gemini API Key (AIzaSy...)" class="w-full px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface mb-2 focus:outline-none focus:border-secondary font-mono text-[11px]"/>
            <div class="flex items-center justify-end gap-2">
              <button id="chatbot-save-key-btn" type="button" class="px-3 py-1 bg-primary text-secondary-container rounded-lg font-semibold hover:bg-primary-container transition-colors">
                Lưu Key
              </button>
            </div>
          </div>

          <!-- VÙNG TIN NHẮN (MESSAGE LOG) -->
          <div id="chatbot-messages" class="flex-1 p-3.5 overflow-y-auto space-y-3 bg-surface/50 text-xs text-on-surface leading-relaxed">
            <!-- Tin nhắn được chèn bằng JS -->
          </div>

          <!-- QUICK SUGGESTION CHIPS -->
          <div id="chatbot-chips-container" class="px-3 py-2 bg-surface-container-lowest border-t border-outline-variant/20 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
            <!-- Chips render bằng JS -->
          </div>

          <!-- INPUT KHUNG CHAT -->
          <div class="p-2.5 bg-surface-container-lowest border-t border-outline-variant/30 flex items-center gap-2 shrink-0">
            <input type="text" id="chatbot-input" placeholder="Hỏi giá, check-in, vị trí..." class="flex-1 bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/40 text-on-surface text-xs focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all" autocomplete="off"/>
            <button id="chatbot-send-btn" type="button" aria-label="Gửi tin nhắn" class="w-9 h-9 rounded-xl bg-primary text-secondary-container hover:bg-accent-hover hover:text-on-primary flex items-center justify-center transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>

        </div>
      `;

      document.body.appendChild(container);

      // Hiển thị bóng chat chào mừng sau 3 giây nếu chưa từng mở chat
      setTimeout(() => {
        if (!this.isOpen && !sessionStorage.getItem('diemchau_teaser_dismissed')) {
          const teaser = document.getElementById('chatbot-teaser');
          if (teaser) teaser.classList.remove('hidden');
        }
      }, 3000);

      this.updateLanguageUI();
      this.renderMessages();
      this.renderChips();
    }

    bindEvents() {
      const toggleBtn = document.getElementById('chatbot-toggle-btn');
      const closeWindowBtn = document.getElementById('chatbot-btn-close-window');
      const teaserClose = document.getElementById('chatbot-teaser-close');
      const input = document.getElementById('chatbot-input');
      const sendBtn = document.getElementById('chatbot-send-btn');
      const clearBtn = document.getElementById('chatbot-btn-clear');
      const settingsBtn = document.getElementById('chatbot-btn-settings');
      const settingsCloseBtn = document.getElementById('chatbot-settings-close-btn');
      const saveKeyBtn = document.getElementById('chatbot-save-key-btn');

      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => this.toggleChat());
      }
      if (closeWindowBtn) {
        closeWindowBtn.addEventListener('click', () => this.closeChat());
      }
      if (teaserClose) {
        teaserClose.addEventListener('click', (e) => {
          e.stopPropagation();
          const teaser = document.getElementById('chatbot-teaser');
          if (teaser) teaser.classList.add('hidden');
          sessionStorage.setItem('diemchau_teaser_dismissed', 'true');
        });
      }
      if (sendBtn) {
        sendBtn.addEventListener('click', () => this.handleSendMessage());
      }
      if (input) {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.handleSendMessage();
          }
        });
      }
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (confirm(this.currentLang === 'en' ? 'Clear all chat messages?' : 'Xóa toàn bộ cuộc trò chuyện?')) {
            this.history = [];
            this.saveHistory();
            this.renderMessages();
          }
        });
      }
      if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
          const panel = document.getElementById('chatbot-settings-panel');
          const inputKey = document.getElementById('chatbot-api-key-input');
          if (panel) {
            panel.classList.toggle('hidden');
            if (inputKey) inputKey.value = this.geminiApiKey;
          }
        });
      }
      if (settingsCloseBtn) {
        settingsCloseBtn.addEventListener('click', () => {
          const panel = document.getElementById('chatbot-settings-panel');
          if (panel) panel.classList.add('hidden');
        });
      }
      if (saveKeyBtn) {
        saveKeyBtn.addEventListener('click', () => {
          const inputKey = document.getElementById('chatbot-api-key-input');
          if (inputKey) {
            this.geminiApiKey = inputKey.value.trim();
            if (this.geminiApiKey) {
              localStorage.setItem(STORAGE_KEY_GEMINI, this.geminiApiKey);
              alert(this.currentLang === 'en' ? 'Gemini API Key saved successfully!' : 'Đã lưu Gemini API Key thành công!');
            } else {
              localStorage.removeItem(STORAGE_KEY_GEMINI);
              alert(this.currentLang === 'en' ? 'Switched to Fast Local Knowledge AI mode.' : 'Đã chuyển về chế độ AI Tri Thức Nội Bộ.');
            }
            const panel = document.getElementById('chatbot-settings-panel');
            if (panel) panel.classList.add('hidden');
            this.updateLanguageUI();
          }
        });
      }

      // Lắng nghe sự kiện chuyển ngôn ngữ toàn trang từ common.js
      window.addEventListener('languageChanged', (e) => {
        this.currentLang = e.detail && e.detail.lang ? e.detail.lang : getCurrentLang();
        this.updateLanguageUI();
        this.renderChips();
        if (this.history.length === 0) {
          this.renderMessages();
        }
      });
    }

    toggleChat() {
      if (this.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }

    openChat() {
      this.isOpen = true;
      const win = document.getElementById('chatbot-window');
      const iconOpen = document.getElementById('chatbot-icon-open');
      const iconClose = document.getElementById('chatbot-icon-close');
      const teaser = document.getElementById('chatbot-teaser');

      if (win) {
        win.classList.remove('hidden');
        win.classList.add('flex');
      }
      if (iconOpen) iconOpen.classList.add('hidden');
      if (iconClose) iconClose.classList.remove('hidden');
      if (teaser) teaser.classList.add('hidden');
      sessionStorage.setItem('diemchau_teaser_dismissed', 'true');

      // Tự động focus input
      setTimeout(() => {
        const input = document.getElementById('chatbot-input');
        if (input && window.innerWidth > 640) input.focus();
        this.scrollToBottom();
      }, 100);
    }

    closeChat() {
      this.isOpen = false;
      const win = document.getElementById('chatbot-window');
      const iconOpen = document.getElementById('chatbot-icon-open');
      const iconClose = document.getElementById('chatbot-icon-close');

      if (win) {
        win.classList.add('hidden');
        win.classList.remove('flex');
      }
      if (iconOpen) iconOpen.classList.remove('hidden');
      if (iconClose) iconClose.classList.add('hidden');
    }

    updateLanguageUI() {
      const texts = KNOWLEDGE_BASE[this.currentLang] || KNOWLEDGE_BASE.vi;
      const title = document.getElementById('chatbot-header-title');
      const subtitle = document.getElementById('chatbot-header-subtitle');
      const input = document.getElementById('chatbot-input');
      const modeBadge = document.getElementById('chatbot-mode-badge');
      const teaserText = document.getElementById('chatbot-teaser-text');
      const quickBook = document.getElementById('chatbot-quick-book');
      const settingsTitle = document.getElementById('chatbot-settings-title');
      const settingsDesc = document.getElementById('chatbot-settings-desc');

      if (title) title.textContent = texts.title;
      if (subtitle) {
        subtitle.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span> ${texts.subtitle}`;
      }
      if (input) input.placeholder = texts.placeholder;
      if (modeBadge) {
        modeBadge.textContent = this.geminiApiKey ? texts.ai_mode_badge_gemini : texts.ai_mode_badge_local;
      }
      if (teaserText) {
        teaserText.textContent = this.currentLang === 'en'
          ? "Need room rates or instant PIN check-in help? Chat with me!"
          : "Cần xem giá phòng hoặc hướng dẫn nhận phòng tự động không ạ? Nhắn em nhé!";
      }
      if (quickBook) quickBook.textContent = texts.book_action;
      if (settingsTitle) settingsTitle.textContent = texts.settings_title;
      if (settingsDesc) settingsDesc.textContent = texts.settings_desc;
    }

    renderChips() {
      const container = document.getElementById('chatbot-chips-container');
      if (!container) return;
      const texts = KNOWLEDGE_BASE[this.currentLang] || KNOWLEDGE_BASE.vi;
      container.innerHTML = '';

      texts.quick_chips.forEach(chip => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'whitespace-nowrap px-2.5 py-1 rounded-full bg-surface-container hover:bg-secondary-container hover:text-on-secondary-container text-primary font-medium text-[11px] transition-colors border border-outline-variant/30 shrink-0';
        btn.textContent = chip.label;
        btn.onclick = () => {
          this.sendMessage(chip.query);
        };
        container.appendChild(btn);
      });
    }

    renderMessages() {
      const container = document.getElementById('chatbot-messages');
      if (!container) return;
      container.innerHTML = '';

      const texts = KNOWLEDGE_BASE[this.currentLang] || KNOWLEDGE_BASE.vi;

      // Nếu chưa có tin nhắn nào, render tin chào mặc định
      if (this.history.length === 0) {
        this.appendMessageToDOM('bot', texts.greeting, false);
      } else {
        this.history.forEach(msg => {
          this.appendMessageToDOM(msg.sender, msg.text, false);
        });
      }

      this.scrollToBottom();
    }

    appendMessageToDOM(sender, text, scroll = true) {
      const container = document.getElementById('chatbot-messages');
      if (!container) return;

      const isUser = sender === 'user';
      const msgDiv = document.createElement('div');
      msgDiv.className = `flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`;

      if (!isUser) {
        msgDiv.innerHTML = `
          <div class="w-7 h-7 rounded-full bg-primary-container text-secondary-container flex items-center justify-center shrink-0 mb-1 border border-secondary-container/30">
            <span class="material-symbols-outlined text-[15px]">smart_toy</span>
          </div>
          <div class="max-w-[85%] bg-surface-container-lowest text-on-surface p-3 rounded-2xl rounded-bl-xs shadow-sm border border-outline-variant/30 leading-relaxed text-[12px]">
            ${formatMarkdown(text)}
          </div>
        `;
      } else {
        msgDiv.innerHTML = `
          <div class="max-w-[85%] bg-primary text-on-primary p-3 rounded-2xl rounded-br-xs shadow-sm leading-relaxed text-[12px]">
            ${formatMarkdown(text)}
          </div>
          <div class="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mb-1">
            <span class="material-symbols-outlined text-[15px]">person</span>
          </div>
        `;
      }

      container.appendChild(msgDiv);
      if (scroll) this.scrollToBottom();
    }

    showTypingIndicator() {
      const container = document.getElementById('chatbot-messages');
      if (!container || document.getElementById('chatbot-typing-bubble')) return;

      const texts = KNOWLEDGE_BASE[this.currentLang] || KNOWLEDGE_BASE.vi;
      const typingDiv = document.createElement('div');
      typingDiv.id = 'chatbot-typing-bubble';
      typingDiv.className = 'flex items-end gap-2 justify-start';
      typingDiv.innerHTML = `
        <div class="w-7 h-7 rounded-full bg-primary-container text-secondary-container flex items-center justify-center shrink-0 mb-1">
          <span class="material-symbols-outlined text-[15px]">smart_toy</span>
        </div>
        <div class="bg-surface-container-lowest text-text-muted px-3 py-2 rounded-2xl rounded-bl-xs shadow-sm border border-outline-variant/30 flex items-center gap-1.5 text-[11px]">
          <span class="inline-flex gap-1 items-center">
            <span class="w-1.5 h-1.5 rounded-full bg-secondary-container animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-secondary-container animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-secondary-container animate-bounce" style="animation-delay: 300ms"></span>
          </span>
          <span class="ml-1">${texts.bot_typing}</span>
        </div>
      `;
      container.appendChild(typingDiv);
      this.scrollToBottom();
    }

    hideTypingIndicator() {
      const indicator = document.getElementById('chatbot-typing-bubble');
      if (indicator) indicator.remove();
    }

    scrollToBottom() {
      const container = document.getElementById('chatbot-messages');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }

    async handleSendMessage() {
      const input = document.getElementById('chatbot-input');
      if (!input) return;
      const text = input.value.trim();
      if (!text || this.isTyping) return;
      input.value = '';
      await this.sendMessage(text);
    }

    async sendMessage(query) {
      if (this.isTyping) return;
      this.isTyping = true;

      // 1. Thêm tin nhắn người dùng
      this.history.push({ sender: 'user', text: query, time: Date.now() });
      this.saveHistory();
      this.appendMessageToDOM('user', query);
      this.showTypingIndicator();

      const sendBtn = document.getElementById('chatbot-send-btn');
      if (sendBtn) sendBtn.disabled = true;

      let answer = '';
      try {
        // 2. Chế độ xử lý: Thử Gemini API nếu có Key, hoặc dùng Local Knowledge
        if (this.geminiApiKey) {
          try {
            answer = await answerWithGeminiAPI(this.geminiApiKey, query, this.currentLang, this.history);
          } catch (geminiErr) {
            console.warn('Gemini API call failed, falling back to Local Knowledge Base:', geminiErr);
            answer = answerWithLocalKnowledge(query, this.currentLang);
          }
        } else {
          // Giả lập độ trễ ngắn 350ms để hiệu ứng gõ phím trông tự nhiên
          await new Promise(r => setTimeout(r, 350));
          answer = answerWithLocalKnowledge(query, this.currentLang);
        }
      } catch (err) {
        console.error('Bot response error:', err);
        answer = answerWithLocalKnowledge(query, this.currentLang);
      } finally {
        this.hideTypingIndicator();
        this.isTyping = false;
        if (sendBtn) sendBtn.disabled = false;
      }

      // 3. Thêm tin nhắn bot
      this.history.push({ sender: 'bot', text: answer, time: Date.now() });
      this.saveHistory();
      this.appendMessageToDOM('bot', answer);
    }
  }

  // Khởi tạo Chatbot khi tài liệu tải xong
  function startChatbot() {
    if (!window.diemChauChatbot) {
      window.diemChauChatbot = new DiemChauChatbot();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startChatbot);
  } else {
    startChatbot();
  }
})();
