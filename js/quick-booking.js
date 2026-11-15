(() => {
  const form = document.getElementById('booking-quick-form');
  if (!form) return;
  const date = document.getElementById('quick-date');
  const time = document.getElementById('quick-time');
  const stay = document.getElementById('quick-stay');
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(p=>[p.type,p.value]));
  date.min = `${parts.year}-${parts.month}-${parts.day}`;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const params = new URLSearchParams({date:date.value,time:time.value,stay:stay.value});
    window.location.href = `/booking?${params}`;
  });
})();
