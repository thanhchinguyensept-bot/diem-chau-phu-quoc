# Backend yêu cầu đặt phòng

Form `/booking` gửi yêu cầu tới `/api/booking-requests` sau khi khách bấm **Gửi yêu cầu đặt phòng**. Chỉ hiện thành công khi API trả HTTP 201; đây là yêu cầu chờ nhà nghỉ kiểm tra và xác nhận, không phải xác nhận phòng tự động. Tab **Yêu cầu đặt phòng** trong `/admin` đọc danh sách, báo số yêu cầu mới và tự làm mới mỗi 20 giây khi trang quản trị đang mở.

Backend lưu tối đa 500 yêu cầu mới nhất trong Upstash Redis, xóa yêu cầu quá 90 ngày khi đọc/ghi, và yêu cầu khóa riêng `BOOKING_ADMIN_KEY` để xem dữ liệu. Preview và Production dùng hai Redis key riêng để dữ liệu kiểm thử không lẫn với yêu cầu thật. Quản trị viên nhập khóa ở tab yêu cầu; khóa chỉ được giữ trong `sessionStorage` của tab đó. PIN giao diện quản trị phía trình duyệt không được dùng để xác thực API. API trả 503 nếu `BOOKING_REQUESTS_ENABLED` chưa là `true` hoặc thiếu cấu hình Redis.

## Cấu hình và triển khai

1. Xác nhận Vercel có `KV_REST_API_URL` và `KV_REST_API_TOKEN` ở môi trường cần bật. Production dùng `BOOKING_ADMIN_KEY`; Preview ưu tiên khóa test riêng `BOOKING_PREVIEW_ADMIN_KEY` rồi mới fallback `BOOKING_ADMIN_KEY`. Không đưa giá trị khóa vào HTML, Git, tài liệu hoặc log.
2. Nhập khóa đúng môi trường vào trường **Khóa quản trị yêu cầu** ở `/admin`; khóa chỉ được giữ trong phiên tab. Không dùng PIN màn hình quản trị làm khóa API.
3. Kiểm thử xác thực admin, lưu và đọc một yêu cầu với dữ liệu giả ở Preview; kiểm tra yêu cầu mới hiện trong tab quản trị và số thông báo tăng khi có bản mới.
4. Chỉ sau khi kiểm thử end-to-end đạt, đặt `BOOKING_REQUESTS_ENABLED=true` trên môi trường tương ứng và triển khai lại.

Các yêu cầu không chứa dữ liệu khách thật trước đây có thể còn trong Redis dưới khóa list v1. Backend mới dùng khóa sorted set v2 để tránh xung đột; nếu cần dọn dữ liệu giả cũ, xác minh đúng DB/key rồi xóa riêng `diemchau:booking-requests:v1`.
