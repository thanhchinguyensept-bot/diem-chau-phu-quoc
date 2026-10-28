/**
 * Blog Data - Nhà Nghỉ Diễm Châu Phú Quốc
 * Tổng hợp 7 bài viết cẩm nang du lịch và lưu trú tự động
 */

const BLOG_POSTS = {
  "huong-dan-smart-pass": {
    id: "huong-dan-smart-pass",
    title: "Hướng dẫn toàn tập quy trình nhận phòng tự động bằng Smart Pass không cần gặp lễ tân tại Diễm Châu",
    category: "Công Nghệ Smart Pass",
    categoryKey: "checkin",
    date: "01/10/2026",
    readTime: "5 phút đọc",
    author: "Diễm Châu CSKH",
    authorRole: "Chuyên gia lưu trú Phú Quốc",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfRCJmJsv6xhQMsoVJHTrYmoO83zHQy7quNGr2wOfEvw2bq399-J_dKtgc3KeECpoBzHxM38XQvkojzRHhw0JqPxWqD4VVmcsfn9HEnDYDrORN0scKYtKClboCuDww0Xkv7Dql6d8ShvLtajjRIHB9mlrZmZihK1jktlHyssgd2tm_DUnlva52sj1Ok46p4cK6891MJCwwYJ4BoKtqs6gMQH_HKT6RxMo2aXtsZlrDnSADmCZ9DYlE",
    excerpt: "Trải nghiệm kỳ nghỉ hoàn toàn tự do với công nghệ mã PIN 4 số bảo mật cao. Quên đi thủ tục xếp hàng rườm rà: Đặt phòng trực tuyến, thanh toán VietQR tức thì và nhận quyền truy cập phòng ngay trên smartphone.",
    content: `
      <p class="lead text-lg font-medium text-on-surface mb-6">Bạn vừa đáp chuyến bay đêm đến Phú Quốc hay muốn tìm một không gian nghỉ ngơi riêng tư tuyệt đối mà không cần qua bất kỳ thủ tục dòm ngó, hỏi han nào? Tại <strong>Nhà Nghỉ Diễm Châu</strong>, quy trình <strong>Smart Pass 100% tự động</strong> sinh ra để trao trọn quyền tự do cho bạn.</p>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">1. Mô hình nhận phòng không chạm là gì?</h2>
      <p class="mb-4">Khác với mô hình khách sạn truyền thống luôn có quầy lễ tân trực chờ kiểm tra giấy tờ, thủ tục rườm rà, Diễm Châu ứng dụng hệ thống khóa số điện tử thông minh kết nối máy chủ đám mây. Bạn chỉ cần thực hiện 3 thao tác đơn giản trên chiếc điện thoại của mình để nhận phòng bất kể lúc 2 giờ sáng hay giữa trưa nắng gắt.</p>

      <div class="my-6 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30">
        <h3 class="font-bold text-secondary text-lg mb-2 flex items-center gap-2">
          <span class="material-symbols-outlined text-secondary">verified_user</span>
          Lợi ích vượt trội của Smart Pass Diễm Châu:
        </h3>
        <ul class="list-disc pl-5 space-y-2 text-on-surface-variant">
          <li><strong>Bảo mật danh tính 100%:</strong> Không chạm mặt người quen hay bất kỳ nhân viên nào.</li>
          <li><strong>Check-in siêu tốc:</strong> Hoàn tất trong vòng chưa đầy 1 phút.</li>
          <li><strong>Chủ động 24/7:</strong> Cửa thông minh luôn sẵn sàng mở cho bạn mọi thời khắc.</li>
        </ul>
      </div>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">2. Quy trình 4 bước nhận phòng tự động</h2>
      <p class="mb-4">Hãy làm theo các bước dưới đây để có một kỳ nghỉ êm đềm và thuận tiện nhất:</p>

      <h3 class="text-xl font-semibold text-primary mt-6 mb-2">Bước 1: Chọn phòng và khung giờ</h3>
      <p class="mb-4">Truy cập website hoặc bấm vào mục <a href="booking.html" class="text-secondary font-semibold underline hover:text-accent-hover">Đặt Phòng Ngay</a>. Chọn loại phòng mong muốn (Standard, Superior hoặc Deluxe) cùng gói thời gian linh hoạt (1h, 3h, 5h hoặc Qua đêm).</p>

      <h3 class="text-xl font-semibold text-primary mt-6 mb-2">Bước 2: Thanh toán chuyển khoản VietQR tự động</h3>
      <p class="mb-4">Hệ thống sẽ hiển thị mã VietQR chính xác kèm số tiền. Mở ứng dụng ngân hàng bất kỳ để quét mã. Giao dịch được xác thực tự động trong <strong>3 đến 5 giây</strong> mà không cần chụp màn hình đối soát thủ công.</p>

      <h3 class="text-xl font-semibold text-primary mt-6 mb-2">Bước 3: Nhận thẻ điện tử Smart Pass</h3>
      <p class="mb-4">Ngay sau khi giao dịch thành công, màn hình sẽ hiển thị <strong>Smart Pass</strong> bao gồm:</p>
      <ul class="list-disc pl-5 space-y-2 mb-4 text-on-surface-variant">
        <li><strong>Số phòng được cấp:</strong> (Ví dụ: Phòng 203 - Tầng 2)</li>
        <li><strong>Mã PIN điện tử:</strong> Dãy 4 số bí mật (chỉ cấp riêng cho bạn).</li>
        <li><strong>Thời gian hiệu lực:</strong> Chính xác từng phút theo gói đặt của bạn.</li>
      </ul>

      <h3 class="text-xl font-semibold text-primary mt-6 mb-2">Bước 4: Mở khóa phòng tự động</h3>
      <p class="mb-4">Khi đến trước cửa phòng tại Diễm Châu:</p>
      <ol class="list-decimal pl-5 space-y-2 mb-6 text-on-surface-variant">
        <li>Chạm nhẹ mu bàn tay vào mặt khóa cảm ứng để bàn phím phát sáng.</li>
        <li>Bấm chính xác 4 số trong mã PIN được cấp.</li>
        <li>Nhấn phím <strong>#</strong> để xác nhận. Khóa sẽ kêu tiếng <em>"bíp"</em> và đèn LED chuyển sang màu xanh lá báo hiệu cửa đã mở.</li>
      </ol>

      <div class="my-8 p-6 rounded-2xl bg-primary text-on-primary">
        <h3 class="text-xl font-bold text-secondary-container mb-2">Cần hỗ trợ trong quá trình nhận phòng?</h3>
        <p class="text-on-primary-container text-sm mb-4">Dù không có lễ tân túc trực làm phiền, đội ngũ CSKH và kỹ thuật Diễm Châu luôn túc trực từ xa qua tổng đài hotline và Zalo 24/7 để hỗ trợ bạn bất kỳ khi nào.</p>
        <div class="flex flex-wrap items-center gap-4">
          <a href="tel:0815719502" class="px-5 py-2.5 rounded-xl bg-secondary-container text-on-secondary-container font-bold hover:bg-accent-hover hover:text-on-primary transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">call</span>
            Hotline: 0815 719 502
          </a>
          <a href="https://zalo.me/0815719502" target="_blank" class="px-5 py-2.5 rounded-xl bg-white/10 text-on-primary font-bold hover:bg-white/20 transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">chat</span>
            Nhắn Zalo CSKH
          </a>
        </div>
      </div>
    `
  },

  "top-5-quan-hai-san-dem": {
    id: "top-5-quan-hai-san-dem",
    title: "Top 5 quán hải sản đêm và chợ đêm Phú Quốc chỉ cách Diễm Châu 5 phút đi xe",
    category: "Ẩm Thực Dương Đông",
    categoryKey: "an-uong",
    date: "28/09/2026",
    readTime: "4 phút đọc",
    author: "Diễm Châu CSKH",
    authorRole: "Thổ địa ẩm thực Phú Quốc",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQRbVdbY2s8ZR4zIfe3fhjYSi_PIBQNwupk4S8nxykWqduB7VoxbPKoI_WaDaBqgeRlTBA-t5zc6CGyhOt5cd5M5bq3VNZ6cKmp5tM6YB4_o72nwhuhWNLO5q0uPRVk-2HzMgOaCFW9fW8sRifHnp36QS-RSgDkOTVvQxeNc8izhLVDcHBTOrGcMYgS6VhHEXITwOi82x3BBB-eJgGxPHxBoyfGA5Yx6BipFcGqgIaWFIAftx0B-3P",
    excerpt: "Thưởng thức ghẹ Hàm Ninh tươi rói, nhum nướng mỡ hành thơm nức mũi với mức giá cực kỳ phải chăng không lo bị chặt chém quanh khu vực trung tâm Dương Đông.",
    content: `
      <p class="lead text-lg font-medium text-on-surface mb-6">Đến Phú Quốc mà chưa thưởng thức hải sản đêm tươi sống là chuyến đi chưa trọn vẹn. Tọa lạc tại trục đường huyết mạch Cách Mạng Tháng Tám - Dương Đông, nghỉ tại <strong>Nhà Nghỉ Diễm Châu</strong> bạn chỉ mất 3 - 5 phút chạy xe để chạm tới những thiên đường ăn uống ngon bổ rẻ nhất đảo ngọc.</p>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">1. Chợ Đêm Phú Quốc (Bạch Đằng - Dương Đông)</h2>
      <p class="mb-3">Cách Diễm Châu khoảng 1.2km (chưa đầy 4 phút xe máy). Đây là thánh địa ẩm thực đêm sầm uất nhất đảo.</p>
      <p class="mb-4"><strong>Món nhất định phải thử:</strong> Nhum biển nướng trứng cút thơm bùi ngậy, mực chớp hấp gừng giòn sần sật, sò điệp nướng phô mai và kem cuộn Thái Lan tráng miệng mát lạnh.</p>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">2. Quán Ốc Cát Biển (Đường 30/4)</h2>
      <p class="mb-3">Địa chỉ ruột của dân địa phương và các bạn trẻ đi phượt. Quán nổi tiếng với mức đồng giá từ 60.000đ - 80.000đ/đĩa ốc các loại.</p>
      <p class="mb-4"><strong>Món đinh:</strong> Ốc hương xào me đậm đà chấm bánh mì, sò lông nướng mỡ hành đậu phộng giòn rụm và cơm chiên ghẹ thơm phức.</p>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">3. Quán Việt Phú Quốc (Đường Trần Hưng Đạo)</h2>
      <p class="mb-3">Nếu bạn muốn thưởng thức món <strong>Gỏi Cá Trích</strong> chuẩn vị truyền thống Phú Quốc thì đây là điểm đến hàng đầu.</p>
      <p class="mb-4">Cá trích tươi sống thái mỏng, bóp gỏi với hành tây, ớt, dừa nạo sợi, cuốn cùng rau rừng và chấm nước mắm nhĩ Phú Quốc pha tỏi ớt đường thốt nốt. Một cảm giác bùng nổ vị giác!</p>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">4. Quán Ra Khơi (Đường 30/4)</h2>
      <p class="mb-3">Không gian rộng rãi, thoáng mát, hải sản bơi sống trong bể kính để bạn tự tay chọn và yêu cầu đầu bếp chế biến.</p>
      <p class="mb-4">Món tôm tít (tôm tích) cháy tỏi và cá bớp nấu canh chua bắp chuối tại đây được đánh giá 10/10 bởi thực khách du lịch.</p>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">5. Hải Sản Bé Ghẹ (Bờ Kè Cửa Sông Dương Đông)</h2>
      <p class="mb-3">Nằm ngay cạnh bờ sông lộng gió, gió biển mát rượi. Quán chuyên các loại ghẹ xanh tuyển chọn tươi roi rói vừa cập bến ghe.</p>
      <p class="mb-4">Thịt ghẹ chắc nịch, ngọt lịm tự nhiên, hấp với bia hoặc chấm muối tiêu chanh ớt sim rừng thì không gì sánh bằng.</p>

      <div class="my-6 p-5 rounded-2xl bg-surface-container-low border border-secondary-container/40">
        <h3 class="font-bold text-secondary text-lg mb-2">💡 Mẹo ăn hải sản không lo bị đắt:</h3>
        <ul class="list-disc pl-5 space-y-1.5 text-on-surface-variant text-sm">
          <li>Luôn hỏi giá theo kg hoặc theo phần trước khi chọn cân hải sản tươi sống.</li>
          <li>Thời điểm hải sản tươi và đủ món nhất là từ 18h30 đến 21h00 mỗi tối.</li>
          <li>Sau một buổi tối no nê, hãy trở về không gian thanh tịnh, máy lạnh mát rượi của Diễm Châu để nghỉ ngơi thật sâu giấc!</li>
        </ul>
      </div>
    `
  },

  "bi-quyet-thue-phong-theo-gio": {
    id: "bi-quyet-thue-phong-theo-gio",
    title: "Bí quyết thuê phòng nghỉ theo giờ sạch sẽ, giá chỉ từ 80k cho cặp đôi & khách công tác tại Dương Đông",
    category: "Mẹo Đặt Phòng",
    categoryKey: "meo-phong",
    date: "25/09/2026",
    readTime: "3 phút đọc",
    author: "Diễm Châu CSKH",
    authorRole: "Cố vấn dịch vụ",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqFNYAjWKSsh8VWkE-o64SnST0mggPGAbCdHVKz2yky5NdhL8AZDGMy5ZjgNTyenJ85pvRHTY1itlrnkYjQOguNr-gWBWeMo_oT9ZmDSDSBLMncwrx2JN11kNEKDaX8n1PRW-Vc4ioqkpjCPVz0dghI6lJxNXsE8sAoB2I_TEzjDQBAHH0LaAzlxfAIgW_LTb6HJKsiMngkgb5QTkpg9m0gUmSkJW2WX5dgFwZ9mBJnPE8Bt_jOgyy",
    excerpt: "Bật mí các gói thời gian 1h, 3h linh hoạt, cách bảo mật danh tính tuyệt đối và tiêu chuẩn phòng ốc luôn tinh tươm như khách sạn 3 sao tại Phú Quốc.",
    content: `
      <p class="lead text-lg font-medium text-on-surface mb-6">Bạn cần một nơi chợp mắt nghỉ ngơi vài giờ trong lúc chờ giờ bay/tàu cao tốc? Cặp đôi đang tìm kiếm một không gian riêng tư, lãng mạn kín đáo tại trung tâm Dương Đông? Hoặc bạn đi công tác cần nơi yên tĩnh để làm việc và tắm mát trước buổi gặp đối tác?</p>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">1. Những bất cập khi thuê phòng theo giờ truyền thống</h2>
      <p class="mb-4">Rất nhiều khách hàng gặp phải tình huống ái ngại khi tìm nhà nghỉ theo giờ: lễ tân nhìn soi mói, giữ CMND/CCCD, phòng có mùi ẩm mốc hoặc thuốc lá, ga gối ố vàng chưa kịp thay. Đó là lý do <strong>Nhà Nghỉ Diễm Châu</strong> ra đời với một tiêu chuẩn hoàn toàn khác biệt.</p>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">2. Bảng giá phòng theo giờ siêu tiết kiệm tại Diễm Châu</h2>
      <div class="overflow-x-auto my-6">
        <table class="w-full text-left border-collapse rounded-xl overflow-hidden shadow-sm">
          <thead>
            <tr class="bg-primary text-on-primary text-sm">
              <th class="p-4">Gói thời gian</th>
              <th class="p-4">Mức giá</th>
              <th class="p-4">Phù hợp nhu cầu</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/30 bg-surface-container-lowest text-sm">
            <tr>
              <td class="p-4 font-bold text-primary">1 Giờ đầu</td>
              <td class="p-4 font-bold text-secondary">80.000đ</td>
              <td class="p-4 text-on-surface-variant">Tắm rửa, thay đồ nhanh, nghỉ ngơi khẩn cấp</td>
            </tr>
            <tr>
              <td class="p-4 font-bold text-primary">3 Giờ đầu</td>
              <td class="p-4 font-bold text-secondary">120.000đ</td>
              <td class="p-4 text-on-surface-variant">Thư giãn, hẹn hò cặp đôi riêng tư (Gói phổ biến nhất)</td>
            </tr>
            <tr>
              <td class="p-4 font-bold text-primary">5 Giờ đầu</td>
              <td class="p-4 font-bold text-secondary">160.000đ</td>
              <td class="p-4 text-on-surface-variant">Nghỉ trưa, làm việc văn phòng, chờ tàu/xe</td>
            </tr>
            <tr>
              <td class="p-4 font-bold text-primary">Qua đêm (Trọn đêm)</td>
              <td class="p-4 font-bold text-secondary">200.000đ - 250.000đ</td>
              <td class="p-4 text-on-surface-variant">Giấc ngủ êm ái đến sáng, tự do check-in lúc đêm muộn</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">3. Bốn cam kết vàng tại Diễm Châu</h2>
      <ul class="space-y-3 mb-6 text-on-surface-variant">
        <li class="flex items-start gap-2">
          <span class="material-symbols-outlined text-secondary shrink-0 mt-0.5">check_circle</span>
          <span><strong>Ga nệm trắng tinh tươm:</strong> Thay mới 100% sau mỗi lượt khách, giặt hấp nhiệt độ cao kháng khuẩn.</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="material-symbols-outlined text-secondary shrink-0 mt-0.5">check_circle</span>
          <span><strong>Tiện nghi đầy đủ:</strong> Máy lạnh Inverter êm ái, máy nước nóng áp lực cao, Smart TV kết nối Youtube, Wifi tốc độ cao.</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="material-symbols-outlined text-secondary shrink-0 mt-0.5">check_circle</span>
          <span><strong>Bảo mật danh tính:</strong> Tự động nhập mã PIN vào phòng, không chạm mặt ai.</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="material-symbols-outlined text-secondary shrink-0 mt-0.5">check_circle</span>
          <span><strong>Hỗ trợ linh hoạt:</strong> Đặt phòng trước qua website, giữ phòng chắc chắn khi đến.</span>
        </li>
      </ul>
    `
  },

  "lich-trinh-phuot-phu-quoc-3n2d": {
    id: "lich-trinh-phuot-phu-quoc-3n2d",
    title: "Lịch trình phượt Bắc Đảo và Nam Đảo Phú Quốc 3 ngày 2 đêm tối ưu chi phí",
    category: "Kinh Nghiệm Du Lịch",
    categoryKey: "kinh-nghiem",
    date: "20/09/2026",
    readTime: "6 phút đọc",
    author: "Diễm Châu CSKH",
    authorRole: "Phượt thủ Phú Quốc",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdNMxmDfKyNxGM1kUjDmBYzH4fg4Y5G3zTYXVlWsYZr6w3q3OzwFy6yUXdT6E1hlitjt0mUsVEEMWIm43alDwzf8pUber4zAIueZpGaI0YxB9BzGNky2W6Jy785_Uw40e8STWYM3j32_LbXOy7UqxFaLOmX2uFDxGDjuQzTYpC65ywZxys5v1_OVOoPj7ZRO42TY-1e7hLjbqPf2qZn6YgML1DRaLJdy3FNh9S4g_uvREzus_KbFlc",
    excerpt: "Hướng dẫn thuê xe máy giá rẻ, khám phá Bãi Sao hoang sơ, check-in Rạch Vẹm ngắm sao biển và điểm nghỉ chân thuận tiện tại trung tâm Dương Đông.",
    content: `
      <p class="lead text-lg font-medium text-on-surface mb-6">Phú Quốc là hòn đảo lớn nhất Việt Nam với diện tích gần 600km². Để khám phá trọn vẹn cả Nam Đảo rực rỡ và Bắc Đảo hoang sơ chỉ trong 3 ngày 2 đêm với ngân sách tiết kiệm nhất, việc chọn điểm dừng chân tại <strong>trung tâm Dương Đông</strong> chính là chìa khóa chiến lược.</p>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">Ngày 1: Dương Đông – Dinh Cậu – Hoàng Hôn San Hô Đỏ</h2>
      <ul class="list-disc pl-5 space-y-2 mb-4 text-on-surface-variant">
        <li><strong>Sáng:</strong> Đến bến tàu Bãi Vòng hoặc sân bay Phú Quốc, di chuyển về nhận phòng tại Diễm Châu (Cách Mạng Tháng Tám). Thuê xe máy tại chỗ chỉ từ 120k/ngày.</li>
        <li><strong>Trưa:</strong> Ăn bún quậy Kiến Xây trứ danh hoặc cơm tấm Huỳnh Nhu.</li>
        <li><strong>Chiều:</strong> Tham quan Dinh Cậu, Dinh Bà, dạo biển bãi Dinh Cậu đón hoàng hôn lãng mạn nhất Phú Quốc.</li>
        <li><strong>Tối:</strong> Quẩy tung Chợ Đêm Dương Đông, thưởng thức hải sản nướng và trà sữa nốt thơm.</li>
      </ul>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">Ngày 2: Chinh phục Nam Đảo – Bãi Sao – Địa Trung Hải</h2>
      <ul class="list-disc pl-5 space-y-2 mb-4 text-on-surface-variant">
        <li><strong>Sáng:</strong> Chạy xe xuống An Thới dọc đường DT46. Ghé Bãi Sao – bãi biển cát trắng mịn như kem và làn nước trong xanh màu ngọc bích.</li>
        <li><strong>Trưa:</strong> Thưởng thức lẩu cá bớp tại Bãi Khem hoặc các quán hải sản địa phương.</li>
        <li><strong>Chiều:</strong> Khám phá thị trấn Hoàng Hôn (Sunset Town) mang kiến trúc Địa Trung Hải rực rỡ sắc màu, check-in Cầu Hôn (Kiss Bridge).</li>
        <li><strong>Tối:</strong> Xem show nhạc nước Kiss of The Sea và pháo hoa rực rỡ mỗi tối trước khi về lại phòng Diễm Châu nghỉ ngơi.</li>
      </ul>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">Ngày 3: Khám phá Bắc Đảo – Làng chài Rạch Vẹm – Mũi Gành Dầu</h2>
      <ul class="list-disc pl-5 space-y-2 mb-4 text-on-surface-variant">
        <li><strong>Sáng:</strong> Chạy xe xuyên qua rừng nguyên sinh Bắc Đảo đến làng chài Rạch Vẹm – vương quốc sao biển tuyệt đẹp (mùa biển lặng từ tháng 11 đến tháng 4).</li>
        <li><strong>Trưa:</strong> Ăn hải sản trên nhà bè nổi Rạch Vẹm với gió biển mát lộng.</li>
        <li><strong>Chiều:</strong> Đến Mũi Gành Dầu ngắm nhìn biên giới hải đảo Campuchia chỉ cách vài hải lý. Trở về Dương Đông mua quà đặc sản (hạt tiêu, nước mắm truyền thống, rượu sim).</li>
        <li><strong>Tối:</strong> Trả phòng tự động siêu tốc và ra sân bay kết thúc chuyến đi tuyệt vời.</li>
      </ul>

      <div class="my-6 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30">
        <h3 class="font-bold text-primary text-lg mb-2">💰 Dự toán chi phí phượt 3N2Đ:</h3>
        <p class="text-sm text-on-surface-variant">Thuê xe máy 3 ngày: 360k • Xăng xe: 150k • Phòng nghỉ Diễm Châu 2 đêm: 450k (chia 2 người = 225k/người) • Ăn uống thả ga: 1.200k. <strong>Tổng chi phí chỉ khoảng 2.000.000đ - 2.500.000đ/người!</strong></p>
      </div>
    `
  },

  "tai-sao-mo-hinh-tu-dong-hoa-smart-lock": {
    id: "tai-sao-mo-hinh-tu-dong-hoa-smart-lock",
    title: "Tại sao mô hình nhà nghỉ tự động hoá (Smart Keypad) đang trở thành xu hướng được yêu thích?",
    category: "Công Nghệ Smart Pass",
    categoryKey: "checkin",
    date: "15/09/2026",
    readTime: "4 phút đọc",
    author: "Diễm Châu CSKH",
    authorRole: "Chuyên gia công nghệ",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHKxylFlfmjzn4g5yFwss9JI4Ly_cdxMuU4wHgtuNAWN3hBH5DtZYtukpMG8xxmO_Zl6tjNKKNwUV9Hu7ptqgvaPJNzLM0DqoO1ePaflHhOSymV_JB0tD8On0beQ0PlkaYxxLAZ33kmfHoh5xXM5goeIy7eqMv_l3Z-RgkUu5CBoH3JYjLOHPEX2ZHvJSLghaA0nAD6MPHg7NF6kMufMcG_lGFDx6xeeTZg_WgALVXkxI4T3zNw_bv",
    excerpt: "Không chạm, không e ngại ánh nhìn của người khác và chủ động 100% thời gian check-in lúc nửa đêm hay sáng sớm mà không cần gọi chủ nhà.",
    content: `
      <p class="lead text-lg font-medium text-on-surface mb-6">Khách du lịch thế hệ mới — đặc biệt là Gen Z, các cặp đôi và người trẻ đi du lịch tự túc — đang dần rời bỏ những khách sạn rườm rà để tìm kiếm các không gian lưu trú ứng dụng công nghệ <strong>Tự động hóa không tiếp xúc (Touchless Hospitality)</strong>. Nhà Nghỉ Diễm Châu tự hào là một trong những đơn vị tiên phong áp dụng mô hình này tại Phú Quốc.</p>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">1. Trút bỏ rào cản e ngại tâm lý</h2>
      <p class="mb-4">Khi đi du lịch hoặc cần thuê phòng nghỉ ngắn giờ, không ít người cảm thấy không thoải mái khi phải đứng trước quầy lễ tân trả lời các câu hỏi: <em>"Thuê mấy giờ?", "Đi mấy người?", "Để lại CMND"</em>... Với Smart Pass tại Diễm Châu, mọi thủ tục đều diễn ra trên màn hình điện thoại riêng tư của bạn. Bạn đến lặng lẽ, rời đi nhẹ nhàng, không gặp ai và không ai làm phiền.</p>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">2. Xóa bỏ giới hạn giờ giấc (Mở cửa 24/7)</h2>
      <p class="mb-4">Nhiều chuyến bay hạ cánh xuống Phú Quốc lúc 1h - 2h sáng, khi hầu hết nhà nghỉ bình dân đã đóng cửa hoặc nhân viên lễ tân ngủ say, gọi cửa rất ngại ngùng. Với hệ thống khóa số tự động, máy chủ hoạt động liên tục 24/7. Bạn đặt phòng lúc 3 giờ sáng và nhận mã mở cửa vào phòng ngay lập tức chỉ trong 30 giây.</p>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">3. Tiêu chuẩn bảo mật tối tân</h2>
      <ul class="list-disc pl-5 space-y-2 mb-6 text-on-surface-variant">
        <li>Mỗi mã PIN 4 số chỉ được khởi tạo riêng cho từng lượt đặt phòng.</li>
        <li>Khóa chỉ mở đúng thời gian đăng ký và tự động vô hiệu hóa ngay khi hết giờ trả phòng.</li>
        <li>Hệ thống lưu trữ lịch sử mã hóa đầu cuối, đảm bảo tuyệt đối an toàn cho cả khách hàng lẫn cơ sở.</li>
      </ul>

      <p class="mb-4">Công nghệ không làm mất đi sự ấm áp, mà trái lại giúp bạn cảm nhận sự tôn trọng không gian riêng tư một cách tuyệt đối nhất.</p>
    `
  },

  "checklist-hanh-ly-phu-quoc": {
    id: "checklist-hanh-ly-phu-quoc",
    title: "Checklist những vật dụng cần thiết khi du lịch Phú Quốc mùa đẹp nhất trong năm",
    category: "Cẩm Nang Du Lịch",
    categoryKey: "kinh-nghiem",
    date: "10/09/2026",
    readTime: "5 phút đọc",
    author: "Diễm Châu CSKH",
    authorRole: "Kinh nghiệm du lịch",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjbS_xP3TgqKJtT_-WwaxHazJFkcKxMKhwAyHzFmr6Nw9DvhWBkr7f4b73EnK_zTBpydp9pq6rLOgSHPb2W1vgIhDbSJWTPLVYUUMISVbLRBteLB-Zijw_Tit1RljcbJd-U6XG3GGpM4YCCcGbPx6Acv6XDqbgcDSalApHjtIGYTdpA-R_jArYIRA8KtX0qVSTPQhorVhL6P8Nzx5hB1d2skQxqyrekmqrz5jUp_kvZApRV2r0GGsd",
    excerpt: "Danh sách đồ dùng gọn nhẹ nhưng đầy đủ: Kem chống nắng thân thiện rạn san hô, đồ bơi, sạc dự phòng và mẹo mang hành lý xách tay nhẹ nhàng.",
    content: `
      <p class="lead text-lg font-medium text-on-surface mb-6">Mùa đẹp nhất tại Phú Quốc kéo dài từ tháng 10 đến hết tháng 4 năm sau. Đây là thời điểm biển lặng sóng êm như mặt gương, nước biển xanh trong thấy đáy và nắng ấm chan hòa. Để chuyến đi hoàn hảo nhất, hãy bỏ túi ngay danh sách đồ dùng sau:</p>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">1. Giấy tờ & Tiền tệ</h2>
      <ul class="list-disc pl-5 space-y-2 mb-4 text-on-surface-variant">
        <li><strong>CCCD / Hộ chiếu gốc:</strong> Cần thiết để lên máy bay, tàu cao tốc.</li>
        <li><strong>Bằng lái xe máy (A1/A2):</strong> Giúp bạn tự tin thuê xe máy vi vu khắp đảo.</li>
        <li><strong>Điện thoại có cài app ngân hàng (VietQR):</strong> Phú Quốc hiện tại hầu như 95% điểm ăn uống, cafe và nhà nghỉ Diễm Châu đều hỗ trợ quét QR thanh toán tức thì.</li>
      </ul>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">2. Đồ đi biển & Bảo vệ làn da</h2>
      <ul class="list-disc pl-5 space-y-2 mb-4 text-on-surface-variant">
        <li><strong>Kem chống nắng (Reef-safe):</strong> Ưu tiên loại chống nước và an toàn cho rạn san hô khi đi lặn biển.</li>
        <li><strong>Kính mát & Nón rộng vành:</strong> Vừa chắn nắng gắt vừa là phụ kiện sống ảo xuất sắc.</li>
        <li><strong>Túi chống nước điện thoại:</strong> Bảo vệ máy khi tắm biển Bãi Sao hoặc đi cano 4 đảo.</li>
      </ul>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">3. Thuốc men & Chăm sóc cá nhân</h2>
      <ul class="list-disc pl-5 space-y-2 mb-4 text-on-surface-variant">
        <li>Thuốc say sóng (uống trước khi lên tàu 30 phút).</li>
        <li>Thuốc tiêu hóa, men vi sinh (phòng khi bụng yếu khi ăn nhiều hải sản lạ).</li>
        <li>Xịt chống muỗi và côn trùng khi đi dạo rừng nguyên sinh hoặc suối Tranh.</li>
      </ul>

      <div class="my-6 p-5 rounded-2xl bg-surface-container-low border border-secondary-container/40">
        <h3 class="font-bold text-secondary text-lg mb-2">💡 Tin vui cho hành lý xách tay của bạn:</h3>
        <p class="text-sm text-on-surface-variant">Khi lưu trú tại <strong>Nhà Nghỉ Diễm Châu</strong>, chúng tôi đã chuẩn bị sẵn đầy đủ khăn tắm tiệt trùng, máy sấy tóc công suất lớn, dầu gội, sữa tắm, bàn chải đánh răng và nước suối đóng chai. Bạn hoàn toàn có thể mang vali gọn nhẹ 7kg để thỏa sức bay bổng!</p>
      </div>
    `
  },

  "quy-trinh-khu-khuan-phong-diem-chau": {
    id: "quy-trinh-khu-khuan-phong-diem-chau",
    title: "Quy trình khử khuẩn và vệ sinh phòng 2 giờ nghiêm ngặt chuẩn Diễm Châu",
    category: "Tiêu Chuẩn Phòng",
    categoryKey: "meo-phong",
    date: "05/09/2026",
    readTime: "4 phút đọc",
    author: "Diễm Châu CSKH",
    authorRole: "Quản lý buồng phòng",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjjl59PYYczrGnTvknF2VR3ANVXU27stutQP4fGNTV3bgcRVfgr2iV46dqn8JmFzyQkMP1YpfVlSu80xJZig1Ut_rxHhVPIWvj2i2rtYqc7r5ayLZZ0by7sJ8QAs-9JVOU4tmxB3nkz08AJxE44Lpt35h46zdbDaiHlxlEGqSrPT7QMt_2Sitler36Rvb6pyALMBLkdtCb1qmTtGTYD2rVQSlP6YBg0varqG5He2pDcWD36pH7EWld",
    excerpt: "Cam kết sạch tinh tươm với 6 bước làm sạch chuyên sâu, thay mới 100% ga nệm vỏ gối và khử khuẩn bằng cồn sát khuẩn trước khi đón lượt khách tiếp theo.",
    content: `
      <p class="lead text-lg font-medium text-on-surface mb-6">Nhiều người e ngại nhà nghỉ giá rẻ thường đi kèm với chất lượng vệ sinh kém. Tại <strong>Nhà Nghỉ Diễm Châu Phú Quốc</strong>, mức giá từ 80k/1h chỉ là mức giá tiếp cận bình dân, nhưng <strong>tiêu chuẩn sạch sẽ luôn là danh dự và nguyên tắc sống còn</strong> của chúng tôi.</p>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">1. Tiêu chuẩn "Sạch Tinh Tươm" không tì vết</h2>
      <p class="mb-4">Mỗi phòng nghỉ sau khi khách trả phòng đều phải trải qua quy trình dọn dẹp và kiểm định kéo dài tối thiểu 30 đến 45 phút bởi đội ngũ buồng phòng chuyên nghiệp, tuân thủ 6 bước khép kín:</p>

      <div class="space-y-4 my-6">
        <div class="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex gap-4 items-start">
          <div class="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shrink-0">1</div>
          <div>
            <h4 class="font-bold text-primary">Thu gom và thay mới 100% đồ vải</h4>
            <p class="text-sm text-on-surface-variant">Toàn bộ drap giường, vỏ gối, chăn ga được tháo bỏ ngay lập tức sau mỗi lượt khách (kể cả khách chỉ thuê 1 giờ). Đồ vải được chuyển đến xưởng giặt sấy công nghiệp ở nhiệt độ 80°C để tiệt trùng tuyệt đối.</p>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex gap-4 items-start">
          <div class="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shrink-0">2</div>
          <div>
            <h4 class="font-bold text-primary">Sát trùng các bề mặt tiếp xúc cao</h4>
            <p class="text-sm text-on-surface-variant">Lau cồn y tế khử khuẩn toàn bộ bàn phím khóa số Smart Lock, tay nắm cửa, công tắc đèn, remote máy lạnh, remote tivi và ấm đun siêu tốc.</p>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex gap-4 items-start">
          <div class="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shrink-0">3</div>
          <div>
            <h4 class="font-bold text-primary">Tẩy rửa buồng tắm & nhà vệ sinh chuyên sâu</h4>
            <p class="text-sm text-on-surface-variant">Vách kính tắm được lau sáng bóng không vết cặn canxi. Bồn cầu được tiệt trùng và dán tem niêm phong vệ sinh an toàn.</p>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex gap-4 items-start">
          <div class="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shrink-0">4</div>
          <div>
            <h4 class="font-bold text-primary">Hút bụi và lau sàn bằng dung dịch sả chanh</h4>
            <p class="text-sm text-on-surface-variant">Sử dụng tinh dầu sả chanh tự nhiên khử sạch hoàn toàn mùi hôi, mang lại hương thơm thảo mộc dịu nhẹ, thư thái.</p>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex gap-4 items-start">
          <div class="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shrink-0">5</div>
          <div>
            <h4 class="font-bold text-primary">Set up bộ đồ dùng mới niêm phong</h4>
            <p class="text-sm text-on-surface-variant">Đặt mới khăn tắm bông mềm, bộ bàn chải kem đánh răng, lược, xà bông và 2 chai nước suối miễn phí.</p>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex gap-4 items-start">
          <div class="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shrink-0">6</div>
          <div>
            <h4 class="font-bold text-primary">Bật thông khí và kiểm tra ánh sáng</h4>
            <p class="text-sm text-on-surface-variant">Phòng được mở thông gió đối lưu không khí 15 phút trước khi khóa lại và kích hoạt mã PIN mới cho khách hàng tiếp theo.</p>
          </div>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-primary mt-8 mb-4">2. Cam kết hoàn tiền nếu không hài lòng</h2>
      <p class="mb-4">Chúng tôi tự tin vào quy trình vệ sinh của mình đến mức: Nếu khi bước vào phòng, bạn phát hiện bất kỳ dấu hiệu tóc trên giường, mùi khó chịu hay nhà vệ sinh chưa sạch, Diễm Châu cam kết <strong>đổi phòng ngay lập tức hoặc hoàn tiền 100%</strong> không điều kiện.</p>
    `
  }
};
