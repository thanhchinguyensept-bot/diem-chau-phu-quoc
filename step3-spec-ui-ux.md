# BƯỚC 3 – SPEC UI/UX CHI TIẾT & KẾ HOẠCH THỰC THI
## Website Nhà Nghỉ Diễm Châu

---

## 1. THÔNG TIN THƯƠNG HIỆU & BỘ NHẬN DIỆN

### 1.1 Bảng màu chính thức

| Vai trò | Màu | Hex Code | Sử dụng |
|---------|-----|----------|---------|
| **Primary** | Xanh navy đậm | `#1B3A4B` | Header, footer, nền section tối, text heading |
| **Accent / CTA** | Vàng ấm | `#D4A853` | Nút "Đặt Ngay", giá phòng, badge nổi bật |
| **Accent hover** | Vàng đậm | `#C09540` | Hover state cho nút CTA |
| **Background chính** | Trắng | `#FFFFFF` | Nền trang chính |
| **Background phụ** | Xám nhạt | `#F7F7F7` | Section phân vùng (Testimonials, Gallery) |
| **Text chính** | Xám đậm | `#2D2D2D` | Nội dung đọc, mô tả |
| **Text phụ** | Xám trung | `#6B7280` | Caption, placeholder, subtitle |
| **Success** | Xanh lá | `#10B981` | Thông báo thành công, badge "Phòng trống" |
| **Danger** | Đỏ | `#EF4444` | Lỗi, badge "Phòng bận", cảnh báo |

### 1.2 Typography (Font chữ)

| Phần | Font | Fallback |
|------|------|----------|
| **Heading (H1-H3)** | Playfair Display | Georgia, serif |
| **Body text** | Inter | system-ui, sans-serif |
| **Monospace (mã PIN)** | JetBrains Mono | monospace |

### 1.3 Logo & Slogan

- **Logo:** File đã cung cấp (icon cửa trong vòng tròn, nền navy)
- **Tên:** Diễm Châu
- **Slogan:** Riêng Tư Tuyệt Đối
- **SEO Title:** Nhà Nghỉ Diễm Châu – Giá rẻ, phòng sạch, kín đáo

### 1.4 Thông tin liên hệ

| Hạng mục | Giá trị |
|----------|---------|
| **Địa chỉ** | Đường Cách Mạng Tháng Tám, Phú Quốc, An Giang 92000, Vietnam |
| **SĐT** | 0942 817 633 |
| **Facebook** | https://www.facebook.com/nhanghidiemchauphuquoc |
| **TikTok** | https://www.tiktok.com/@nhanghidiemchau |
| **Google Maps** | [Link bản đồ](https://www.google.com/maps/place/Nh%C3%A0+ngh%E1%BB%89+Di%E1%BB%85m+Ch%C3%A2u/@10.2303061,103.9685939,18z) |

### 1.5 Thông tin thanh toán (VietQR)

| Hạng mục | Giá trị |
|----------|---------|
| **Ngân hàng** | TPBank |
| **Số tài khoản** | 88188968888 |
| **Chủ tài khoản** | NGUYEN CHI THANH |
| **Mã ngân hàng (VietQR)** | 970423 |

### 1.6 Bảng giá phòng

| Gói | Thời lượng | Giá (VNĐ) |
|-----|-----------|-----------|
| 1 giờ | 1h | 80.000 đ |
| 3 giờ | 3h | 100.000 đ |
| 5 giờ | 5h | 140.000 đ |
| Qua đêm | 12h trưa → 12h trưa hôm sau | 200.000 đ |

> **Lưu ý:** Giá đồng nhất cho cả 4 phòng (101, 102, 103, 104).

---

## 2. SPEC GIAO DIỆN TỪNG TRANG

### 2.1 HEADER (Chung cho tất cả trang)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [LOGO Diễm Châu]  Trang Chủ | Phòng Nghỉ | Đặt Phòng | Blog | Liên Hệ  🌐VN/EN  [ĐẶT NGAY] │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **Logo:** Bên trái, ảnh logo + text "DIỄM CHÂU"
- **Menu:** 5 tab chính giữa
- **Nút VN/EN:** Toggle ngôn ngữ
- **Nút "Đặt Ngay":** Màu vàng ấm `#D4A853`, bo tròn, nổi bật
- **Mobile:** Menu hamburger (☰), logo nhỏ, nút "Đặt Ngay" thu gọn
- **Sticky header** khi cuộn xuống (nền navy `#1B3A4B`)

---

### 2.2 TRANG CHỦ (`index.html`)

#### Section 1 – Hero Banner
- **Background:** Ảnh toàn cảnh homestay/phòng nghỉ (full-width, overlay gradient tối)
- **Tiêu đề lớn:** "Nghỉ Ngơi. Thư Giãn. Riêng Tư." (font Playfair Display, màu trắng)
- **Subtitle:** "Nhà nghỉ giá rẻ, phòng sạch, kín đáo tại Phú Quốc"
- **2 nút CTA:**
  - `[KHÁM PHÁ PHÒNG]` – nền trong suốt, viền trắng
  - `[ĐẶT PHÒNG NGAY]` – nền vàng ấm `#D4A853`

#### Section 2 – Thanh đặt phòng nhanh (Quick Booking Bar)
```
┌───────────────┬───────────────┬───────────────┬───────────────┬──────────────┐
│ 📅 Ngày đến    │ 📅 Ngày đi    │ ⏰ Giờ đến    │ ⏰ Giờ đi     │ [KIỂM TRA]  │
└───────────────┴───────────────┴───────────────┴───────────────┴──────────────┘
```
- Nằm ngay dưới hero (hơi chồng lên hero banner)
- Nền trắng, bóng đổ nhẹ
- Nút "Kiểm Tra" màu vàng ấm → chuyển sang trang Đặt Phòng với dữ liệu đã chọn

#### Section 3 – Điểm nổi bật (USP Icons)
4 icon với text ngắn:
| Icon | Tiêu đề | Mô tả |
|------|---------|-------|
| 💰 | Giá Cả Hợp Lý | Chỉ từ 80.000đ/giờ |
| 🧹 | Phòng Sạch Sẽ | Vệ sinh kỹ sau mỗi khách |
| 🔒 | Riêng Tư Tuyệt Đối | Kín đáo, an toàn, yên tâm |
| ⚡ | Đặt Phòng Tức Thì | QR thanh toán, nhận phòng ngay |

#### Section 4 – Preview 4 Phòng (Room Cards)
- 4 card ngang hàng (2x2 trên mobile)
- Mỗi card: Ảnh phòng + Tên (Phòng 101/102/103/104) + Giá từ 80k + Nút "Xem Chi Tiết"
- Dưới cards: Nút "XEM TẤT CẢ PHÒNG" → link sang `/rooms.html`

#### Section 5 – Trải nghiệm (Gallery Preview)
- Grid ảnh 4-6 tấm (hover zoom nhẹ)
- Tiêu đề: "Không Gian Ấm Cúng Tại Diễm Châu"

#### Section 6 – Đánh giá khách hàng (Testimonials)
- Carousel 3 card review (ảnh avatar, tên, rating sao, nhận xét)
- Nền xám nhạt `#F7F7F7`

#### Section 7 – CTA Footer Banner
- Nền navy `#1B3A4B`
- Text: "Sẵn sàng cho chuyến nghỉ tiếp theo?"
- Nút: `[ĐẶT PHÒNG NGAY]` – vàng ấm

---

### 2.3 TRANG PHÒNG NGHỈ (`rooms.html`)

#### Layout
- **Banner nhỏ** trên cùng: "Phòng Nghỉ Tại Diễm Châu"
- **4 card phòng** (full-width card cho mỗi phòng):

```
┌──────────────────────────────────────────────────┐
│  [ẢNH PHÒNG lớn]                                │
│                                                  │
│  PHÒNG 101                                       │
│  ─────────────────────────────                   │
│  Mô tả: Phòng đôi, máy lạnh, wifi, nước nóng   │
│                                                  │
│  Tiện nghi: 🛏 Giường đôi | ❄️ Máy lạnh |       │
│             📶 WiFi | 🚿 Nước nóng              │
│                                                  │
│  Bảng giá:                                       │
│  ┌──────┬──────┬──────┬─────────┐                │
│  │ 1h   │ 3h   │ 5h   │ Qua đêm│                │
│  │ 80k  │ 100k │ 140k │ 200k   │                │
│  └──────┴──────┴──────┴─────────┘                │
│                                                  │
│                        [ĐẶT PHÒNG NÀY →]        │
└──────────────────────────────────────────────────┘
```

- Nút "Đặt Phòng Này" → chuyển sang `/booking.html?room=101`

---

### 2.4 TRANG ĐẶT PHÒNG (`booking.html`) – Luồng 7 bước

#### Bước ① – Chọn thời gian
```
┌─────────────────────────────────────────────┐
│  CHỌN THỜI GIAN ĐẶT PHÒNG                  │
│                                             │
│  Loại:  ○ Theo giờ    ○ Qua đêm            │
│                                             │
│  📅 Ngày đến: [01/10/2026]    hoặc [Hôm nay]│
│  📅 Ngày đi:  [02/10/2026]                  │
│  ⏰ Giờ đến:  [14:00]                       │
│  ⏰ Giờ đi:   [17:00]                       │
│                                             │
│  Timeline:                                  │
│  ├── Check-in:  14:00 ngày 01/10            │
│  ├── Check-out: 17:00 ngày 01/10            │
│  └── Dọn phòng: 19:00 ngày 01/10 (2h buffer)│
│                                             │
│              [TIẾP TỤC →]                   │
└─────────────────────────────────────────────┘
```

#### Bước ② – Hiển thị phòng trống
```
┌─────────────────────────────────────────────┐
│  PHÒNG CÒN TRỐNG (14:00 - 17:00, 01/10)    │
│                                             │
│  ┌─────┐  ┌─────┐  ┌─────┐                 │
│  │ 101 │  │ 102 │  │ 104 │    ❌ 103 bận    │
│  │ ✅   │  │ ✅   │  │ ✅   │                 │
│  └─────┘  └─────┘  └─────┘                 │
│                                             │
│  Nhấn chọn phòng bạn muốn đặt              │
└─────────────────────────────────────────────┘
```

#### Bước ③ – Chọn phòng (xác nhận xung đột)
- Khách nhấn chọn → hệ thống kiểm tra lần cuối → nếu OK, highlight phòng đã chọn

#### Bước ④ – Nhập số điện thoại
```
┌─────────────────────────────────────────────┐
│  THÔNG TIN LIÊN HỆ                         │
│                                             │
│  📱 Số điện thoại: [0912 345 678]           │
│                                             │
│              [TIẾP TỤC →]                   │
└─────────────────────────────────────────────┘
```

#### Bước ⑤ – Tóm tắt đơn đặt phòng + QR
```
┌─────────────────────────────────────────────┐
│  ĐƠN ĐẶT PHÒNG CỦA BẠN                    │
│  ────────────────────────                   │
│  3 giờ                                      │
│                                             │
│  01 tháng 10 ────── 01 tháng 10             │
│  Thứ Tư              Thứ Tư                │
│  từ lúc 14:00        đến 17:00              │
│                                             │
│  ──────────────────────────────             │
│  Phòng:              100.000 đ              │
│  PHÒNG 101                                  │
│                                             │
│  Dịch vụ:                                   │
│  Dầu gội, sữa tắm       Bao gồm           │
│  Nước suối               Bao gồm           │
│  ──────────────────────────────             │
│  Tổng cộng:          100.000 đ              │
│  ──────────────────────────────             │
│                                             │
│  ┌───────────────────┐                      │
│  │                   │                      │
│  │   [MÃ QR VIETQR]  │                      │
│  │                   │                      │
│  └───────────────────┘                      │
│  TPBank: 8818 8968 888                      │
│  NGUYEN CHI THANH                           │
│                                             │
│  Quét mã QR để thanh toán                   │
└─────────────────────────────────────────────┘
```

#### Bước ⑥ – Thanh toán (Tự động)
- Hệ thống lắng nghe webhook SePay (SSE real-time)
- Khi TPBank nhận tiền → xác nhận tự động → chuyển sang bước 7

#### Bước ⑦ – Smart Pass
```
┌─────────────────────────────────────────────┐
│  🎉 THANH TOÁN THÀNH CÔNG!                  │
│                                             │
│  ┌─────────────────────────┐                │
│  │    SMART PASS            │                │
│  │    ──────────            │                │
│  │    Phòng: 101            │                │
│  │    Mã PIN: 7633          │                │
│  │    Check-in: 14:00       │                │
│  │    Check-out: 17:00      │                │
│  │    Ngày: 01/10/2026      │                │
│  └─────────────────────────┘                │
│                                             │
│  Vui lòng chụp màn hình để lưu lại         │
└─────────────────────────────────────────────┘
```

---

### 2.5 TRANG BLOG (`blog.html`)

#### Layout
- **Banner:** "Blog – Trải Nghiệm & Mẹo Du Lịch"
- **Grid bài viết:** 3 cột (desktop), 1 cột (mobile)
- Mỗi card blog:
```
┌────────────────────┐
│ [ẢNH BÀI VIẾT]    │
│                    │
│ 📅 01/10/2026      │
│ Tiêu đề bài viết  │
│ Mô tả ngắn 2 dòng │
│                    │
│ [Đọc thêm →]      │
└────────────────────┘
```
- **Chi tiết bài viết** (`blog-detail.html`): Ảnh lớn, nội dung full, bài liên quan, nút chia sẻ

#### SEO cho Blog
- Mỗi bài viết có `<title>`, `<meta description>`, OG tags riêng
- Schema.org `BlogPosting` JSON-LD
- URL thân thiện

---

### 2.6 TRANG LIÊN HỆ (`contact.html`)

```
┌──────────────────────────────────────────────────────┐
│  LIÊN HỆ DIỄM CHÂU                                  │
│                                                      │
│  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │ 📱 0942 817 633   │  │                          │  │
│  │ 📍 Đường CMT8,    │  │   [GOOGLE MAPS EMBED]    │  │
│  │    Phú Quốc       │  │   (iframe nhúng trực     │  │
│  │                   │  │    tiếp bản đồ Google)   │  │
│  │ 🔗 Facebook       │  │                          │  │
│  │ 🔗 TikTok         │  │                          │  │
│  │                   │  │                          │  │
│  │ ────────────────  │  └──────────────────────────┘  │
│  │ GỬI TIN NHẮN     │                                │
│  │ Tên: [________]   │                                │
│  │ SĐT: [________]   │                                │
│  │ Nội dung: [____]  │                                │
│  │   [GỬI]           │                                │
│  └──────────────────┘                                │
└──────────────────────────────────────────────────────┘
```

- **Google Maps iframe:** Nhúng trực tiếp bản đồ tọa độ `10.2302348, 103.9699028`
- **Social links:** Facebook + TikTok (icon click được)

---

### 2.7 TRANG GIỚI THIỆU (`about.html`)

- **Banner:** "Câu Chuyện Diễm Châu"
- **Section 1:** Lịch sử & giới thiệu (text + ảnh)
- **Section 2:** Giá trị cốt lõi (3 icon: Giá rẻ, Sạch sẽ, Riêng tư)
- **Section 3:** Gallery ảnh không gian (grid responsive)
- **CTA:** "Trải nghiệm ngay" → link đặt phòng

---

### 2.8 TRANG QUẢN TRỊ (`admin.html`) – Bảo vệ PIN

#### Màn hình đăng nhập
- Input PIN (4 số) + Nút "Đăng Nhập"
- PIN mặc định: `7633`

#### 7 Tab Admin

**Tab 1: Dashboard Tổng Quan**
| Metric | Hiển thị |
|--------|----------|
| Doanh thu hôm nay | Card số lớn, màu xanh lá |
| Doanh thu tuần | Card |
| Doanh thu tháng | Card |
| Số phòng trống | Badge xanh lá |
| Số phòng đang sử dụng | Badge đỏ |
| Tổng đơn hôm nay | Số |

**Tab 2: Quản Lý Phòng**
- 4 card phòng (101–104): trạng thái (Trống ✅ / Có khách 🔴 / Đang dọn 🟡)
- Mã PIN hiện tại của từng phòng
- Nút: Khóa phòng / Mở phòng (thủ công)

**Tab 3: Lịch Sử Giao Dịch**
- Bảng: STT | SĐT | Phòng | Check-in | Check-out | Số tiền | Mã PIN | Thời gian
- Bộ lọc: theo ngày, theo phòng
- Tìm kiếm theo SĐT

**Tab 4: Thông Tin Khách Hàng**
- Bảng: SĐT | Tên (nếu có) | Số lần đặt | Tổng chi tiêu | Lần cuối đặt
- Tìm kiếm theo SĐT

**Tab 5: Thống Kê Doanh Thu**
- Biểu đồ cột: doanh thu theo ngày (7 ngày gần nhất)
- Biểu đồ tròn: tỷ lệ gói (1h/3h/5h/đêm)
- Tổng thu – Tổng chi = **Lợi nhuận ròng**

**Tab 6: Quản Lý Chi Phí Vật Tư**
- Bảng vật tư:

| STT | Sản phẩm | Số lượng | Đơn giá | Tổng chi |
|-----|----------|---------|---------|---------|
| 1 | Dầu gội | 50 | 5.000 đ | 250.000 đ |
| 2 | Sữa tắm | 50 | 5.000 đ | 250.000 đ |
| 3 | Nước suối | 100 | 3.000 đ | 300.000 đ |
| 4 | Trà xanh | 30 | 8.000 đ | 240.000 đ |
| 5 | Number One | 20 | 10.000 đ | 200.000 đ |
| 6 | Red Bull | 20 | 15.000 đ | 300.000 đ |
| 7 | Bàn chải đánh răng | 50 | 3.000 đ | 150.000 đ |
| 8 | Bột giặt | 20 | 10.000 đ | 200.000 đ |
| 9 | Nước xả vải | 10 | 20.000 đ | 200.000 đ |

- Nút: **Thêm vật tư** / **Sửa** / **Xóa**
- **Chi phí phát sinh:** Form thêm (mô tả + số tiền + ngày)
- **Tổng chi phí** = Vật tư + Phát sinh

**Tab 7: Quản Lý Blog**
- Bảng bài viết: Tiêu đề | Ngày đăng | Trạng thái (Đã đăng / Nháp)
- Nút: **Thêm bài** / **Sửa** / **Xóa**
- Form viết bài: Tiêu đề, Nội dung (textarea), Ảnh đại diện, Tags

---

## 3. ĐẶC TẢ KỸ THUẬT

### 3.1 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/rooms` | Lấy danh sách phòng + trạng thái |
| GET | `/api/rooms/available?from=...&to=...` | Lấy phòng trống theo khung giờ |
| POST | `/api/bookings/intent` | Gửi intent đặt phòng |
| GET | `/api/bookings/schedule` | Lấy lịch đặt phòng (intents + confirmed) |
| POST | `/api/sepay-webhook` | Nhận webhook thanh toán từ SePay |
| GET | `/api/transactions` | Lấy danh sách giao dịch (Admin) |
| GET | `/api/customers` | Lấy danh sách khách hàng (Admin) |
| GET | `/api/expenses` | Lấy danh sách chi phí vật tư |
| POST | `/api/expenses` | Thêm chi phí vật tư |
| PUT | `/api/expenses/:id` | Sửa chi phí |
| DELETE | `/api/expenses/:id` | Xóa chi phí |
| GET | `/api/blog` | Lấy danh sách bài blog |
| POST | `/api/blog` | Thêm bài blog |
| PUT | `/api/blog/:id` | Sửa bài blog |
| DELETE | `/api/blog/:id` | Xóa bài blog |
| GET | `/api/stats/revenue` | Thống kê doanh thu |
| GET | `/api/events` | SSE stream (real-time thanh toán) |

### 3.2 Database Schema (SQLite)

```sql
-- Bảng phòng
CREATE TABLE rooms (
    id TEXT PRIMARY KEY,          -- '101', '102', '103', '104'
    name TEXT,
    description TEXT,
    is_available INTEGER DEFAULT 1,
    current_pin TEXT,
    status TEXT DEFAULT 'available'  -- 'available', 'occupied', 'cleaning'
);

-- Bảng giao dịch
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sepay_id TEXT UNIQUE,
    room TEXT,
    phone TEXT,
    amount REAL,
    content TEXT,
    pin_code TEXT,
    check_in TEXT,
    check_out TEXT,
    cleaning_until TEXT,
    package TEXT,                  -- '1h', '3h', '5h', 'overnight'
    date_str TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng khách hàng
CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE,
    name TEXT,
    total_bookings INTEGER DEFAULT 0,
    total_spent REAL DEFAULT 0,
    last_booking DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng chi phí vật tư
CREATE TABLE expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,            -- 'Dầu gội', 'Sữa tắm', ...
    category TEXT DEFAULT 'supply', -- 'supply' hoặc 'misc' (phát sinh)
    quantity INTEGER DEFAULT 0,
    unit_price REAL DEFAULT 0,
    total_cost REAL DEFAULT 0,
    note TEXT,
    date_str TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng bài blog
CREATE TABLE blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_vi TEXT NOT NULL,
    title_en TEXT,
    content_vi TEXT NOT NULL,
    content_en TEXT,
    thumbnail TEXT,                -- URL ảnh đại diện
    tags TEXT,                     -- 'du-lich,phu-quoc,meo'
    status TEXT DEFAULT 'published', -- 'published' hoặc 'draft'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

-- Bảng intent đặt phòng (tạm)
CREATE TABLE pending_intents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room TEXT,
    phone TEXT,
    check_in TEXT,
    check_out TEXT,
    cleaning_until TEXT,
    package TEXT,
    amount REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.3 SEO Meta Tags (mỗi trang)

```html
<!-- Trang chủ -->
<title>Nhà Nghỉ Diễm Châu – Giá rẻ, phòng sạch, kín đáo | Phú Quốc</title>
<meta name="description" content="Nhà nghỉ Diễm Châu Phú Quốc - Phòng sạch, giá rẻ chỉ từ 80.000đ/giờ, riêng tư tuyệt đối. Đặt phòng online, thanh toán VietQR, nhận phòng tức thì.">
<meta name="keywords" content="nhà nghỉ Phú Quốc, phòng nghỉ giá rẻ, nhà nghỉ kín đáo, Diễm Châu, đặt phòng online">

<!-- Open Graph -->
<meta property="og:title" content="Nhà Nghỉ Diễm Châu – Riêng Tư Tuyệt Đối">
<meta property="og:description" content="Phòng sạch, giá rẻ từ 80k/h. Đặt phòng online, thanh toán QR, nhận phòng ngay tại Phú Quốc.">
<meta property="og:image" content="/assets/og-image.jpg">
<meta property="og:type" content="website">

<!-- JSON-LD Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Hotel",
  "name": "Nhà Nghỉ Diễm Châu",
  "description": "Nhà nghỉ giá rẻ, phòng sạch, riêng tư tuyệt đối tại Phú Quốc",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Đường Cách Mạng Tháng Tám",
    "addressLocality": "Phú Quốc",
    "addressRegion": "An Giang",
    "postalCode": "92000",
    "addressCountry": "VN"
  },
  "telephone": "+84942817633",
  "priceRange": "80000-200000 VND",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "10.2302348",
    "longitude": "103.9699028"
  }
}
</script>
```

### 3.4 Đa ngôn ngữ VN/EN

- **Cơ chế:** Dictionary JS (`lang.js`) chứa tất cả text VN/EN
- **Toggle:** Nút `🌐 VN | EN` trên header
- **Lưu trạng thái:** `localStorage.setItem('lang', 'vi')` hoặc `'en'`
- **Mặc định:** Tiếng Việt (`vi`)

### 3.5 Responsive Design (Mobile-First)

| Breakpoint | Màn hình | Ghi chú |
|------------|----------|---------|
| < 640px | Mobile | Menu hamburger, 1 cột, full-width cards |
| 640-1024px | Tablet | 2 cột grid |
| > 1024px | Desktop | Sidebar + 3 cột, sticky header |

---

## 4. CHECKLIST KỸ THUẬT

- [ ] Tất cả trang có meta SEO tags (title, description, OG, JSON-LD)
- [ ] Toggle VN/EN hoạt động trên tất cả trang
- [ ] Responsive trên mobile/tablet/desktop
- [ ] Google Maps nhúng đúng vị trí trên trang Liên Hệ
- [ ] VietQR sinh đúng memo format: `DIEMCHAU P<room> <phone>`
- [ ] Webhook SePay xử lý đúng + cấp PIN
- [ ] Admin dashboard hiển thị doanh thu, giao dịch, chi phí
- [ ] Quản lý vật tư: thêm/sửa/xóa + tổng chi phí
- [ ] Blog: thêm/sửa/xóa bài + hiển thị frontend
- [ ] Thống kê: Tổng thu – Tổng chi = Lợi nhuận
- [ ] Timeline booking: 2h buffer dọn phòng
- [ ] Kiểm tra xung đột phòng theo khung giờ

---

> ⚠️ **CHỜ DUYỆT:** Anh xem qua toàn bộ Spec UI/UX chi tiết này.  
> - **"Duyệt"** → Em chuyển sang **Bước 4 (Thiết kế Mockup HTML)**.  
> - **Chỉnh sửa** → Cho em biết phần nào cần thay đổi.
