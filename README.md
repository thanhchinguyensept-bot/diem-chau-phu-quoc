# 🏨 Nhà Nghỉ Diễm Châu Phú Quốc - Hệ Thống Đặt Phòng & Smart Lock Tự Động 100%

Dự án website chính thức của **Nhà Nghỉ Diễm Châu Phú Quốc** – Mô hình lưu trú thông minh tự động hóa hoàn toàn 24/7 không cần quầy tiếp tân, nhận phòng riêng tư tuyệt đối qua vé điện tử **Smart Pass** và khóa số PIN đồng bộ thời gian thực.

---

## 🌟 Điểm Nổi Bật Của Hệ Thống

1. **Quy Trình Tự Động Hóa 100% (Zero-Staff Front Desk):**
   - Khách xem trạng thái phòng trống thời gian thực kết nối cảm ứng cửa.
   - Chọn gói linh hoạt: **Nghỉ theo giờ (2h, 3h, 4h)** hoặc **Lưu trú qua đêm (24h trọn gói: 12h trưa - 12h trưa)**.
   - Điền số điện thoại nhận mã mở cửa (4 số cuối làm mã PIN).

2. **Thanh Toán Tức Thì Bằng VietQR Động:**
   - Tự động sinh mã VietQR chuẩn Napas247 theo số tiền và mã hóa đơn riêng biệt (`DC-XXXX`).
   - Thông tin tài khoản ngân hàng thụ hưởng:
     - **Ngân hàng:** TPBank (Mã BIN: `970423`)
     - **Số tài khoản:** `88188968888`
     - **Chủ tài khoản:** `NGUYEN CHI THANH`
   - Nhận diện thanh toán tự động, chuyển hướng sang vé điện tử **Smart Pass** không cần chờ duyệt thủ công.

3. **Vé Điện Tử Smart Pass Tiện Lợi:**
   - Hiển thị mã PIN mở cửa phòng và cổng chính.
   - Hướng dẫn mở khóa bằng video / hình ảnh trực quan.
   - Tích hợp nút chạm để gọi trợ giúp khẩn cấp 24/7 và bản đồ chỉ đường GPS.

4. **Trang Quản Trị Viên (Admin Dashboard) Độc Quyền:**
   - **Cổng bảo mật mã PIN:** Yêu cầu nhập đúng mã PIN bảo mật `7633` mới được truy cập.
   - **Quản lý 4 phòng nghỉ (P.101, P.102, P.103, P.104):** Bật/tắt khóa số từ xa, theo dõi trạng thái khách đang ở.
   - **Bộ đệm dọn phòng 2 tiếng:** Khi khách check-out, phòng tự động chuyển sang chế độ khử trùng đèn UV trong 2 giờ và kích hoạt thông báo Telegram Webhook tới đội ngũ vệ sinh.
   - **Quản lý kho vật tư tiêu hao:** Modal thêm vật tư mới, nhập số lượng tồn kho (nước suối, bàn chải, khăn tắm...).
   - **Quản lý nội dung SEO:** Modal tạo bài viết mới và chỉnh sửa cẩm nang du lịch Phú Quốc.

---

## 📁 Cấu Trúc Mã Nguồn (Sitemap)

| Đường Dẫn Tĩnh | Đường Dẫn Vercel Clean URL | Mô Tả Chức Năng |
| :--- | :--- | :--- |
| `index.html` | `/` | Trang chủ giới thiệu, cam kết riêng tư, vị trí bản đồ, tổng quan phòng |
| `rooms.html` | `/phong-nghi` | Danh sách 4 hạng phòng chi tiết, tiện nghi, bảng giá giờ & đêm |
| `booking.html` | `/dat-phong` | Quy trình đặt phòng 6 bước, tính tiền tự động, VietQR động |
| `smart-pass.html` | `/smart-pass` | Vé điện tử Smart Pass hiển thị mã PIN mở khóa cửa phòng |
| `blog.html` | `/blog` | Cẩm nang du lịch Phú Quốc, mẹo tự động check-in |
| `contact.html` | `/lien-he` | Bản đồ GPS, thông tin liên hệ, hotline hỗ trợ 24/7 |
| `admin.html` | `/admin` | Cổng quản trị viên mã PIN 7633, quản lý phòng, kho & SEO |
| `prototype.html` | `/prototype` | Bản demo SPA all-in-one tích hợp cả 7 màn hình để trải nghiệm |

---

## 🚀 Hướng Dẫn Vận Hành & Trải Nghiệm Cục Bộ

1. Mở trực tiếp file `index.html` hoặc `prototype.html` bằng bất kỳ trình duyệt web nào (Chrome, Safari, Edge).
2. Thử đặt phòng tại `booking.html`:
   - Chọn loại phòng mong muốn.
   - Chọn gói nghỉ (theo giờ hoặc qua đêm).
   - Nhập số điện thoại `0942 817 633`.
   - Xem mã QR tự động cập nhật số tiền chính xác.
   - Bấm nút **"Xác Nhận Đã Thanh Toán"** để mô phỏng nhận vé **Smart Pass** tức thì.
3. Truy cập `admin.html`:
   - Nhập mã PIN: **`7633`**.
   - Bấm mở khóa phòng 101, xác nhận dọn phòng UV 103, kiểm tra modal vật tư và SEO bài viết.

---

## ☁️ Hướng Dẫn Triển Khai Lên Vercel (Deployment)

Dự án đã được tích hợp sẵn file cấu hình [`vercel.json`](vercel.json) hỗ trợ Clean URLs và cấu hình bảo mật.

### Cách 1: Đẩy mã nguồn lên GitHub (Khuyên dùng)
1. Khởi tạo Git trong thư mục dự án:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Diem Chau Phu Quoc smart hotel web system"
   ```
2. Tạo một repository mới trên GitHub (ví dụ: `diemchau-phuquoc`).
3. Đẩy code lên GitHub:
   ```bash
   git remote add origin https://github.com/<tai-khoan-cua-ban>/diemchau-phuquoc.git
   git branch -M main
   git push -u origin main
   ```
4. Đăng nhập vào [Vercel](https://vercel.com) $\rightarrow$ Chọn **"Add New Project"** $\rightarrow$ Import repository GitHub vừa tạo $\rightarrow$ Bấm **"Deploy"**.
5. Vercel sẽ tự động cấp một tên miền miễn phí, ví dụ: `https://diemchau-phuquoc.vercel.app`.

### Cách 2: Triển khai trực tiếp qua Vercel CLI
Nếu máy có cài đặt Node.js và Vercel CLI:
```bash
npm i -g vercel
vercel --prod
```

---

## 🛡️ Thiết Lập Môi Trường & Bảo Mật

- **Mã PIN Quản Trị:** `7633` (được lưu tại `localStorage.getItem('DC_ADMIN_SESSION')`).
- **Khóa Số Khách Hàng:** 4 số cuối số điện thoại khách đặt.
- **Trạng Thái Phòng:** Tự động đồng bộ liên tục qua `localStorage.getItem('dc_rooms_status')`.

---
*Bản quyền © 2026 Nhà Nghỉ Diễm Châu Phú Quốc. Tất cả quyền được bảo lưu.*
