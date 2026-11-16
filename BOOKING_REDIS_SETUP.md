# Backend yêu cầu đặt phòng

Form `/booking` gửi yêu cầu tới `/api/booking-requests` sau khi khách bấm **Gửi yêu cầu đặt phòng**. Chỉ hiện thành công khi API trả HTTP 201; đây là yêu cầu chờ nhà nghỉ kiểm tra và xác nhận, không phải xác nhận phòng tự động. Tab **Yêu cầu đặt phòng** trong `/admin` đọc danh sách, báo số yêu cầu mới và tự làm mới mỗi 20 giây khi trang quản trị đang mở.

Backend lưu tối đa 500 yêu cầu mới nhất trong Upstash Redis, xóa yêu cầu quá 90 ngày khi đọc/ghi, và tách namespace Preview/Production. Quản trị viên đăng nhập một lần bằng PIN 6 số; API xác thực PIN ở máy chủ, khóa thử sai 5 lần trong 15 phút theo IP, rồi cấp cookie phiên HttpOnly/Secure/SameSite. Tab yêu cầu tự tải danh sách, badge và polling 20 giây sau khi phiên hợp lệ; không còn khóa API riêng trong giao diện. PIN ban đầu nằm trong Secret `ADMIN_LOGIN_PIN`; `ADMIN_SESSION_SECRET` là secret ngẫu nhiên riêng để ký phiên. API từ chối đọc danh sách khi không có phiên máy chủ hợp lệ.

## Cấu hình và triển khai

1. Cấu hình `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `ADMIN_LOGIN_PIN` (6 chữ số) và `ADMIN_SESSION_SECRET` (ít nhất 64 ký tự ngẫu nhiên) dạng Secret ở môi trường cần bật. Không đưa các giá trị này vào HTML, Git, tài liệu hoặc log.
2. Đặt `BOOKING_REQUESTS_ENABLED=true` trên môi trường cần bật. Deploy lại để áp dụng environment variables.
3. Đăng nhập `/admin` bằng PIN; trang tự gọi API, lưu yêu cầu ở Redis, và hiện badge khi có yêu cầu mới.
4. Thử mã sai 5 lần sẽ khóa đăng nhập theo IP trong 15 phút. Có thể đổi PIN tại **Đổi Mã PIN** sau khi đăng nhập; mã mới được lưu dạng hash trong Redis.

Các yêu cầu không chứa dữ liệu khách thật trước đây có thể còn trong Redis dưới khóa list v1. Backend mới dùng khóa sorted set v2 để tránh xung đột; nếu cần dọn dữ liệu giả cũ, xác minh đúng DB/key rồi xóa riêng `diemchau:booking-requests:v1`.
