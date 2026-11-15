# Chuẩn bị backend đặt phòng

Theo yêu cầu ngày 15/11/2026, trang `/booking` hiện chỉ tính giá dự kiến và hướng khách gọi điện hoặc nhắn Zalo. Trang không thu thông tin cá nhân và không gửi yêu cầu tới API. Tab **Yêu cầu đặt phòng** trong `/admin` hiện chỉ là giao diện chờ kết nối.

Upstash Redis đã được kết nối với project Vercel. Mã API `/api/booking-requests` và giao diện đọc danh sách trong `js/admin-booking-requests.js` đã được chuẩn bị nhưng API trả 503 cho mọi yêu cầu khi chưa có `BOOKING_REQUESTS_ENABLED=true`. Không thêm biến bật này cho đến khi kiểm thử đầy đủ luồng admin và có kế hoạch xử lý yêu cầu mới.

Khi triển khai backend sau:

1. Xác nhận Vercel có `KV_REST_API_URL`, `KV_REST_API_TOKEN`, và secret `BOOKING_ADMIN_KEY` ở Production/Preview. Không đưa giá trị khóa vào HTML, Git hoặc tài liệu.
2. Kiểm thử xác thực admin, lưu và đọc yêu cầu trên Preview; kiểm tra khóa trong admin khớp giá trị ở Vercel. Tài khoản admin hiện tại có cơ chế PIN phía trình duyệt riêng, cần xem lại trước khi dùng cho dữ liệu khách.
3. Kết nối lại form `/booking` với API, hiển thị thành công chỉ sau HTTP 201, và thêm lại giao diện đọc danh sách vào tab admin.
4. Chỉ sau khi kiểm thử đầu cuối, đặt `BOOKING_REQUESTS_ENABLED=true` trên môi trường tương ứng và triển khai lại.

Một yêu cầu kiểm thử không chứa dữ liệu khách thật đã được tạo trước khi tạm dừng backend, mã `DC-MWHNC1OX-3B2A`. Có thể xóa trực tiếp trong Redis khi hoàn thiện luồng quản trị.
