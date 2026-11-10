(() => {
  const room = new URLSearchParams(window.location.search).get('room');
  if (!/^(101|102|103|104)$/.test(room || '')) return;
  const section = document.getElementById('room-context');
  const field = document.getElementById('room-message');
  const status = document.getElementById('room-message-status');
  document.getElementById('selected-room').textContent = room;
  field.value = `Chào Nhà nghỉ Diễm Châu, tôi muốn hỏi phòng ${room}. Ngày đến: …; giờ dự kiến: …; gói nghỉ: …. Nhà nghỉ kiểm tra giúp tôi còn phòng không? Cảm ơn!`;
  section.hidden = false;
  document.getElementById('copy-room-message').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(field.value);
      status.textContent = 'Đã sao chép. Anh chị có thể mở Zalo, dán nội dung và bổ sung ngày giờ.';
    } catch {
      field.focus();
      field.select();
      status.textContent = 'Hãy sao chép nội dung đã chọn, rồi dán vào Zalo.';
    }
  });
})();
