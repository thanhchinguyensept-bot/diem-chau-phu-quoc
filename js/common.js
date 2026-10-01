// js/common.js – Quản lý Đa Ngôn Ngữ (i18n) & Tiện ích dùng chung cho Diễm Châu Phú Quốc

const TRANSLATIONS = {
  vi: {
    // Header & Navigation
    'brand_slogan': 'Riêng Tư Tuyệt Đối',
    'nav_home': 'Trang Chủ',
    'nav_rooms': 'Phòng Nghỉ',
    'nav_booking': 'Đặt Phòng',
    'nav_blog': 'Blog',
    'nav_contact': 'Liên Hệ',
    'btn_book_now': 'ĐẶT NGAY',

    // Stepper
    'stepper_subtitle': 'Quy Trình Tự Động 100%',
    'stepper_title': 'Đặt Phòng Trực Tuyến & Nhận Khóa Tức Thì',
    'stepper_smartpass_status': 'Hệ thống mở khóa Smart Pass sẵn sàng 24/7',
    'step1_title': 'B.1 Giờ & Ngày',
    'step2_title': 'B.2 Lọc Trống',
    'step3_title': 'B.3 Chọn Phòng',
    'step4_title': 'B.4 Nhập SĐT',
    'step5_title': 'B.5 VietQR',
    'step6_title': 'B.6 Xác Nhận',
    'step7_title': 'B.7 Smart Pass',

    // Step 1: Package
    'step1_heading': 'Chọn Gói Đặt & Khung Giờ',
    'step1_sub': 'Nhận phòng tự động 24/7 theo mốc giờ linh hoạt',
    'stay_type_label': 'Hình Thức Lưu Trú',
    'pkg_hourly': 'Theo Giờ',
    'pkg_hourly_sub': 'Chỉ từ 80k',
    'pkg_overnight': 'Qua Đêm (12:00 - 12:00)',
    'pkg_overnight_badge': '200k / đêm',
    'hourly_duration_label': 'Thời lượng theo giờ:',
    'overnight_info_title': 'Gói Lưu Trú Qua Đêm Trọn Gói',
    'overnight_info_badge': '24H Tiêu Chuẩn',
    'overnight_info_sub': 'Check-in 12:00 trưa hôm nay đến 12:00 trưa hôm sau (24 tiếng trọn vẹn)',
    'label_checkin_date': 'Ngày Nhận Phòng',
    'label_checkout_date': 'Ngày Trả Phòng',
    'label_checkin_time': 'Giờ Nhận Phòng',
    'btn_today': 'Hôm nay',
    'quick_nights_label': 'Chọn nhanh:',

    // Step 2 & 3: Rooms
    'step2_heading': 'Xem Trạng Thái & Chọn Phòng',
    'step2_sub': 'Bộ cảm ứng cửa kết nối thời gian thực',
    'room_status_available': 'Trống',
    'room_status_occupied': 'Đang bận',
    'room_selected': 'ĐÃ CHỌN',
    'btn_select_room': 'Chọn',
    'btn_selected_room': 'Phòng Này',

    // Step 4: Phone
    'step4_heading': 'Thông Tin Nhận Mã Smart Pass',
    'step4_sub': 'Không yêu cầu CCCD tại quầy • Nhận mã khóa PIN qua SMS/Zalo tức thì',
    'label_guest_phone': 'Số Điện Thoại Nhận PIN',
    'badge_phone_required': 'Bắt buộc',
    'phone_hint': '4 số cuối cài làm mã mở khóa cửa phòng',
    'step4_auto_activation': 'Kích Hoạt Smart Pass',
    'step4_auto_badge': 'Tự động 100%',
    'step4_auto_desc': 'Kích hoạt mã PIN ngay khi quét VietQR',
    'step4_auto_hint': 'Hệ thống mở khóa 24/7 không cần tiếp tân',

    // Step 5: Invoice & Payment
    'invoice_heading': 'Chi Tiết Hóa Đơn',
    'invoice_selected_room': 'Phòng Đã Chọn',
    'invoice_time_range': 'Khung Giờ',
    'invoice_amenities_label': 'Tiện Nghi Bao Gồm Miễn Phí:',
    'amenity_shampoo': 'Dầu gội & Sữa tắm',
    'amenity_water': '02 Nước suối đóng chai',
    'amenity_towel': 'Khăn tắm khử khuẩn & Smart Pass',
    'invoice_cleaning_fee': 'Phí dịch vụ & dọn phòng',
    'free_badge': 'MIỄN PHÍ',
    'invoice_total_label': 'Tổng thanh toán',
    'vietqr_gateway_title': 'Cổng VietQR Chuyển Khoản Tức Thì',
    'scan_qr_prompt': 'Quét mã bằng bất kỳ App Ngân Hàng',
    'beneficiary_bank': 'Ngân hàng thụ hưởng',
    'bank_account_number': 'Số tài khoản',
    'bank_account_holder': 'Chủ tài khoản',
    'amount_to_transfer': 'Số tiền cần chuyển',
    'transfer_memo_label': 'Nội dung chuyển khoản (Bắt buộc)',
    'btn_copy': 'Sao chép',
    'sepay_status_listening': 'Cổng SePAY đang tự động kiểm tra giao dịch (2.5s)...',
    'sepay_status_success': 'Thanh toán thành công qua SePAY! Khóa PIN Smart Pass đã kích hoạt.',

    // Smart Pass
    'smartpass_heading': 'Smart Pass Kỹ Thuật Số',
    'pin_code_label': 'Mã PIN Mở Cửa (Bấm # sau khi nhập)',
    'smartpass_status_verified': 'Mã mở khóa khả dụng và kích hoạt tự động trên khóa từ',
    'btn_download_pass': 'Tải Smart Pass',
    'btn_screenshot_pass': 'Chụp Màn Hình',
    'support_emergency': 'Hỗ trợ khẩn cấp mở cửa tại phòng: 0942 817 633 (Phục vụ 24/7)',

    // Footer
    'footer_about': 'Nhà nghỉ boutique tiện nghi, phòng sạch tiêu chuẩn, mức giá chỉ từ 80k. Cam kết trải nghiệm riêng tư tuyệt đối, tự động hoá nhận phòng siêu tốc tại Phú Quốc.',
    'footer_contact_title': 'Liên Hệ',
    'footer_address': 'Đường Cách Mạng Tháng Tám, Dương Đông, Phú Quốc',
    'footer_policies_title': 'Chính Sách & Giờ Giấc',
    'footer_policy_1': 'Linh hoạt theo giờ & Qua đêm trọn gói (12h - 12h)',
    'footer_policy_2': 'Check-in tức thì qua Smart Pass (Mã PIN tự sinh)',
    'footer_policy_3': 'Bảo mật thông tin khách hàng tuyệt đối',
    'footer_policy_4': 'Hỗ trợ đổi giờ & hủy phòng thuận tiện',
    'footer_hotline_title': 'Hotline 24/7',
    'footer_hotline_sub': 'Đội ngũ kỹ thuật & CSKH luôn sẵn sàng đồng hành cùng kỳ nghỉ của bạn.',
    'footer_emergency': 'Khẩn cấp & Đặt chỗ'
  },
  en: {
    // Header & Navigation
    'brand_slogan': 'Absolute Privacy',
    'nav_home': 'Home',
    'nav_rooms': 'Rooms',
    'nav_booking': 'Booking',
    'nav_blog': 'Blog',
    'nav_contact': 'Contact',
    'btn_book_now': 'BOOK NOW',

    // Stepper
    'stepper_subtitle': '100% Automated Process',
    'stepper_title': 'Book Online & Receive Smart Key Instantly',
    'stepper_smartpass_status': 'Smart Pass Keyless Access Ready 24/7',
    'step1_title': 'S.1 Date & Time',
    'step2_title': 'S.2 Availability',
    'step3_title': 'S.3 Select Room',
    'step4_title': 'S.4 Mobile No.',
    'step5_title': 'S.5 VietQR Pay',
    'step6_title': 'S.6 Verified',
    'step7_title': 'S.7 Smart Pass',

    // Step 1: Package
    'step1_heading': 'Select Stay Package & Schedule',
    'step1_sub': 'Automated 24/7 check-in with flexible hours',
    'stay_type_label': 'Accommodation Type',
    'pkg_hourly': 'Hourly Stay',
    'pkg_hourly_sub': 'From 80k VND',
    'pkg_overnight': 'Overnight (12:00 - 12:00)',
    'pkg_overnight_badge': '200k / night',
    'hourly_duration_label': 'Hourly duration:',
    'overnight_info_title': 'Standard 24H Overnight Package',
    'overnight_info_badge': '24H Standard',
    'overnight_info_sub': 'Check-in 12:00 noon today until 12:00 noon next day (Full 24 hours)',
    'label_checkin_date': 'Check-in Date',
    'label_checkout_date': 'Check-out Date',
    'label_checkin_time': 'Check-in Time',
    'btn_today': 'Today',
    'quick_nights_label': 'Quick select:',

    // Step 2 & 3: Rooms
    'step2_heading': 'Room Availability & Selection',
    'step2_sub': 'Real-time smart door sensor status',
    'room_status_available': 'Available',
    'room_status_occupied': 'Occupied',
    'room_selected': 'SELECTED',
    'btn_select_room': 'Select',
    'btn_selected_room': 'This Room',

    // Step 4: Phone
    'step4_heading': 'Smart Pass Access Information',
    'step4_sub': 'No front desk ID required • Instant keypad PIN via SMS/Zalo',
    'label_guest_phone': 'Mobile Phone for PIN Code',
    'badge_phone_required': 'Required',
    'phone_hint': 'Last 4 digits will become your door PIN code',
    'step4_auto_activation': 'Smart Pass Key Activation',
    'step4_auto_badge': '100% Automated',
    'step4_auto_desc': 'PIN activates immediately upon VietQR payment',
    'step4_auto_hint': '24/7 keyless access without reception',

    // Step 5: Invoice & Payment
    'invoice_heading': 'Invoice Summary',
    'invoice_selected_room': 'Selected Room',
    'invoice_time_range': 'Schedule',
    'invoice_amenities_label': 'Complimentary Amenities Included:',
    'amenity_shampoo': 'Organic Shampoo & Shower Gel',
    'amenity_water': '02 Bottled Mineral Waters',
    'amenity_towel': 'Sanitized Towels & Smart Pass',
    'invoice_cleaning_fee': 'Service & Housekeeping',
    'free_badge': 'FREE',
    'invoice_total_label': 'Total Amount',
    'vietqr_gateway_title': 'Instant VietQR Bank Transfer Gateway',
    'scan_qr_prompt': 'Scan QR with any Mobile Banking App',
    'beneficiary_bank': 'Beneficiary Bank',
    'bank_account_number': 'Account Number',
    'bank_account_holder': 'Account Holder',
    'amount_to_transfer': 'Amount to Transfer',
    'transfer_memo_label': 'Transfer Memo (Required)',
    'btn_copy': 'Copy',
    'sepay_status_listening': 'SePAY Gateway checking payment in real-time (2.5s)...',
    'sepay_status_success': 'Payment confirmed via SePAY! Smart Pass door PIN activated.',

    // Smart Pass
    'smartpass_heading': 'Digital Smart Pass',
    'pin_code_label': 'Door Unlock PIN (Press # after PIN)',
    'smartpass_status_verified': 'Passcode active & synchronized with smart lock',
    'btn_download_pass': 'Download Pass',
    'btn_screenshot_pass': 'Screenshot',
    'support_emergency': '24/7 Room Emergency Assistance: 0942 817 633',

    // Footer
    'footer_about': 'Boutique accommodation, hygienic standards, starting from 80k. Guaranteed absolute privacy and lightning-fast automated check-in in Phu Quoc.',
    'footer_contact_title': 'Contact Us',
    'footer_address': 'Cach Mang Thang Tam St, Duong Dong, Phu Quoc',
    'footer_policies_title': 'Policies & Hours',
    'footer_policy_1': 'Flexible hourly & Overnight packages (12h - 12h)',
    'footer_policy_2': 'Instant check-in via automated Smart Pass PIN',
    'footer_policy_3': 'Strict customer data confidentiality',
    'footer_policy_4': 'Convenient schedule change & cancellation',
    'footer_hotline_title': '24/7 Hotline',
    'footer_hotline_sub': 'Technical and guest support team always ready to assist your stay.',
    'footer_emergency': 'Emergency & Bookings'
  }
};

// Global language switcher function
let currentLanguage = localStorage.getItem('diemchau_language') || 'vi';

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('diemchau_language', lang);

  // Update header badges
  const btnVn = document.getElementById('btn-lang-vn');
  const btnEn = document.getElementById('btn-lang-en');

  if (btnVn && btnEn) {
    if (lang === 'vi') {
      btnVn.className = 'text-secondary-container font-bold cursor-pointer transition-colors';
      btnEn.className = 'text-outline-variant hover:text-on-primary cursor-pointer transition-colors';
    } else {
      btnVn.className = 'text-outline-variant hover:text-on-primary cursor-pointer transition-colors';
      btnEn.className = 'text-secondary-container font-bold cursor-pointer transition-colors';
    }
  }

  // Update elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.textContent = TRANSLATIONS[lang][key];
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.placeholder = TRANSLATIONS[lang][key];
    }
  });

  // Dispatch custom event for page-specific text updates
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

// Auto-initialize on load
document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLanguage);

  // Bind clicks to VN / EN buttons
  const btnVn = document.getElementById('btn-lang-vn');
  const btnEn = document.getElementById('btn-lang-en');

  if (btnVn) btnVn.addEventListener('click', () => setLanguage('vi'));
  if (btnEn) btnEn.addEventListener('click', () => setLanguage('en'));
});
