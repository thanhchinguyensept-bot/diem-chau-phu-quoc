(() => {
  const desktop = document.getElementById('booking-quick-form');
  if (!desktop) return;
  const $ = (id) => document.getElementById(id);
  const dateVN = () => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', {timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit'}).formatToParts(new Date()).map(x => [x.type, x.value]));
    return `${p.year}-${p.month}-${p.day}`;
  };
  const nextDay = (value) => { const d = new Date(`${value}T12:00:00`); d.setDate(d.getDate() + 1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  const today = dateVN();
  const clock = Object.fromEntries(new Intl.DateTimeFormat('en-US', {timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', hourCycle: 'h23'}).formatToParts(new Date()).map(x => [x.type, x.value]));
  const late = Number(clock.hour) >= 23;
  const defaultDate = late ? nextDay(today) : today;
  const defaultTime = late ? '08:00' : `${String(Math.max(14, Number(clock.hour) + 1)).padStart(2,'0')}:00`;
  const date = $('quick-date');
  const time = $('quick-time');
  const checkout = $('quick-checkout');
  date.min = $('mobile-quick-date').min = today;
  date.value = $('mobile-quick-date').value = defaultDate;
  time.value = $('mobile-quick-time').value = defaultTime;
  checkout.min = nextDay(defaultDate);
  $('mobile-quick-checkout').min = nextDay(defaultDate);
  $('mobile-quick-checkout').value = nextDay(defaultDate);
  date.addEventListener('change', () => { checkout.min = nextDay(date.value || today); if (checkout.value && checkout.value < checkout.min) checkout.value = checkout.min; });
  desktop.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!desktop.reportValidity()) return;
    if (checkout.value && checkout.value <= date.value) { checkout.setCustomValidity('Ngày trả phòng phải sau ngày nhận phòng.'); checkout.reportValidity(); return; }
    checkout.setCustomValidity('');
    const params = new URLSearchParams({date: date.value, time: time.value});
    if (checkout.value) { params.set('stay','qua đêm'); params.set('checkout',checkout.value); }
    location.href = `/booking?${params}`;
  });
  checkout.addEventListener('change', () => checkout.setCustomValidity(''));
  const mobile = {mode: 'hourly', hours: 1};
  const update = () => {
    document.querySelectorAll('[data-quick-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.quickMode === mobile.mode)));
    document.querySelectorAll('[data-quick-hours]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.quickHours) === mobile.hours)));
    $('mobile-quick-hours').hidden = mobile.mode !== 'hourly';
    $('mobile-quick-checkout-wrap').hidden = mobile.mode !== 'overnight';
    const params = new URLSearchParams({date: $('mobile-quick-date').value || defaultDate, time: $('mobile-quick-time').value || defaultTime, stay: mobile.mode === 'hourly' ? `${mobile.hours} giờ` : 'qua đêm'});
    if (mobile.mode === 'overnight') params.set('checkout', $('mobile-quick-checkout').value || nextDay(defaultDate));
    $('mobile-quick-continue').href = `/booking?${params}`;
  };
  document.querySelectorAll('[data-quick-mode]').forEach(b => b.addEventListener('click', () => { mobile.mode = b.dataset.quickMode; update(); }));
  document.querySelectorAll('[data-quick-hours]').forEach(b => b.addEventListener('click', () => { mobile.hours = Number(b.dataset.quickHours); update(); }));
  ['mobile-quick-date','mobile-quick-time','mobile-quick-checkout'].forEach(id => $(id).addEventListener('change', () => { if (id === 'mobile-quick-date') { $('mobile-quick-checkout').min = nextDay($(id).value || today); if ($('mobile-quick-checkout').value < $('mobile-quick-checkout').min) $('mobile-quick-checkout').value = $('mobile-quick-checkout').min; } update(); }));
  update();
})();
