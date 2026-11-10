(() => {
  const form = document.getElementById('booking-quick-form');
  if (!form) return;
  const date = document.getElementById('quick-date');
  const time = document.getElementById('quick-time');
  const stay = document.getElementById('quick-stay');
  const panel = document.getElementById('quick-message-panel');
  const message = document.getElementById('quick-message');
  const status = document.getElementById('quick-status');
  const localDate = new Date();
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
  date.min = localDate.toISOString().slice(0, 10);
  form.addEventListener('input', () => { panel.hidden = true; });
  form.addEventListener('change', () => { panel.hidden = true; });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const [year, month, day] = date.value.split('-');
    message.value = `Chào Nhà nghỉ Diễm Châu, tôi muốn hỏi phòng ngày ${day}/${month}/${year}, dự kiến đến lúc ${time.value}, nghỉ ${stay.value}. Xin cho biết phòng còn trống. Cảm ơn!`;
    panel.hidden = false;
    status.textContent = 'Sao chép nội dung, mở Zalo và gửi cho nhà nghỉ.';
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  document.getElementById('quick-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(message.value);
      status.textContent = 'Đã sao chép. Mở Zalo, dán nội dung và nhấn gửi.';
    } catch (_) {
      message.focus();
      message.select();
      status.textContent = 'Hãy sao chép nội dung đã chọn, mở Zalo và nhấn gửi.';
    }
  });
})();
