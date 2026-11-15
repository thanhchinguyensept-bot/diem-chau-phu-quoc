(() => {
  const $ = (id) => document.getElementById(id);
  const priceByHours = {1: 80000, 2: 100000, 3: 100000, 4: 140000, 5: 140000, 6: 180000};
  const state = {mode: 'hourly', hours: 3, room: 'auto'};
  const dateVN = () => {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit'}).formatToParts(new Date()).map(p => [p.type, p.value]));
    return `${parts.year}-${parts.month}-${parts.day}`;
  };
  const dateStr = (date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const addDays = (value, days) => { const d = new Date(`${value}T12:00:00`); d.setDate(d.getDate()+days); return dateStr(d); };
  const nights = () => Math.round((Date.parse($('overnight-out').value) - Date.parse($('overnight-in').value)) / 86400000);
  const money = (amount) => `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;
  const displayDate = (value) => value ? value.split('-').reverse().join('/') : 'Chọn ngày';
  const summary = () => {
    const overnight = state.mode === 'overnight';
    const amount = overnight ? Math.max(1,nights() || 1) * 200000 : priceByHours[state.hours];
    $('sum-mode').textContent = overnight ? `Qua đêm · ${Math.max(1,nights() || 1)} đêm` : `Theo giờ · ${state.hours} giờ`;
    $('sum-room').textContent = state.room === 'auto' ? 'Nhờ xếp phòng' : `Phòng ${state.room}`;
    if (overnight) {
      $('sum-checkin').textContent = `${displayDate($('overnight-in').value)} · 12:00`;
      $('sum-checkout').textContent = `${displayDate($('overnight-out').value)} · 12:00`;
    } else {
      const date = $('hourly-date').value;
      const time = $('hourly-time').value || '14:00';
      const [h, m] = time.split(':').map(Number);
      const end = `${String((h+state.hours)%24).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
      $('sum-checkin').textContent = `${displayDate(date)} · ${time}`;
      $('sum-checkout').textContent = `${displayDate(date && h+state.hours>=24 ? addDays(date,1) : date)} · ${end}`;
    }
    $('sum-total').textContent = money(amount);
    $('mobile-sum-total').textContent = money(amount);
    return amount;
  };
  const today = dateVN();
  $('hourly-date').min = $('overnight-in').min = today;
  $('hourly-date').value = $('overnight-in').value = today;
  const timeParts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).map(p => [p.type,p.value]));
  const currentTime = `${timeParts.hour}:${timeParts.minute}`;
  if ($('hourly-time').value < currentTime) {
    if (Number(timeParts.hour) < 23) $('hourly-time').value = `${String(Number(timeParts.hour)+1).padStart(2,'0')}:00`;
    else { $('hourly-date').value = addDays(today,1); $('hourly-time').value = '08:00'; }
  }
  $('overnight-out').min = addDays(today, 1);
  $('overnight-out').value = addDays(today, 1);
  const query = new URLSearchParams(location.search);
  if (/^(101|102|103|104)$/.test(query.get('room') || '')) state.room = query.get('room');
  if (/^\d{4}-\d{2}-\d{2}$/.test(query.get('date') || '') && query.get('date') >= today) {
    $('hourly-date').value = $('overnight-in').value = query.get('date');
    $('overnight-out').value = addDays(query.get('date'),1);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(query.get('checkout') || '') && query.get('checkout') > $('overnight-in').value) $('overnight-out').value = query.get('checkout');
  if (/^([01]\d|2[0-3]):[0-5]\d$/.test(query.get('time') || '') && ($('hourly-date').value > today || query.get('time') >= currentTime)) $('hourly-time').value = query.get('time');
  if (query.get('stay') === 'qua đêm') state.mode='overnight';
  const stayHours = Number((query.get('stay') || '').replace(' giờ',''));
  if (priceByHours[stayHours]) state.hours=stayHours;
  const sync = () => {
    document.querySelectorAll('[data-mode]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.mode === state.mode)));
    document.querySelectorAll('[data-hours]').forEach(el => el.setAttribute('aria-pressed', String(Number(el.dataset.hours) === state.hours)));
    document.querySelectorAll('[data-room]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.room === state.room)));
    $('hourly-fields').hidden = state.mode !== 'hourly';
    $('overnight-fields').hidden = state.mode !== 'overnight';
    summary();
  };
  document.querySelectorAll('[data-mode]').forEach(el => el.addEventListener('click', () => {state.mode=el.dataset.mode;sync();}));
  document.querySelectorAll('[data-hours]').forEach(el => el.addEventListener('click', () => {state.hours=Number(el.dataset.hours);sync();}));
  document.querySelectorAll('[data-room]').forEach(el => el.addEventListener('click', () => {state.room=el.dataset.room;sync();}));
  document.querySelectorAll('input[type=date],input[type=time]').forEach(el => el.addEventListener('change', () => {
    if (el.id === 'overnight-in' && $('overnight-out').value <= el.value) $('overnight-out').value=addDays(el.value,1);
    $('overnight-out').min=addDays($('overnight-in').value,1); summary();
  }));
  $('menu-button').addEventListener('click', () => {
    const open = $('main-nav').classList.toggle('is-open');
    $('menu-button').setAttribute('aria-expanded', String(open));
  });
  sync();
})();
