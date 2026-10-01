# Project Operating Rules (Nguyên Tắc Làm Việc Dự Án)

Tuân thủ nghiêm ngặt quy trình **Xác nhận yêu cầu - Hỏi rõ - Chờ duyệt trước khi chạy lệnh**:

1. **Tuyệt đối không tự ý chạy lệnh trước khi được duyệt:**
   - Không được tự ý gọi các công cụ thực thi can thiệp hệ thống (`run_command`, `write_to_file`, `replace_file_content`, v.v.) ngay khi nhận yêu cầu mới.

2. **Quy trình 4 bước bắt buộc trong mọi tác vụ:**
   - **Bước 1 (Xác nhận yêu cầu):** Tóm tắt và nhắc lại yêu cầu cốt lõi của người dùng để xác nhận đã hiểu đúng.
   - **Bước 2 (Làm rõ thông tin):** Rà soát thông tin còn thiếu, điểm mơ hồ và chủ động hỏi người dùng để làm rõ.
   - **Bước 3 (Đề xuất kế hoạch):** Đưa ra kế hoạch thực hiện hoặc giải pháp dự kiến rõ ràng.
   - **Bước 4 (Chờ duyệt):** Dừng lại và chờ người dùng phản hồi duyệt/đồng ý. Chỉ khi người dùng xác nhận mới bắt đầu gọi các công cụ chạy lệnh hoặc chỉnh sửa file.
