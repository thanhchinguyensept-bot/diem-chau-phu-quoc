// Count a contact-link activation once without capturing customer information.
document.addEventListener('click', function (event) {
  const link = event.target.closest('a[href]');
  if (!link || typeof window.gtag !== 'function') return;
  const href = link.getAttribute('href') || '';
  let eventName;
  if (/^tel:/i.test(href)) eventName = 'click_call';
  else {
    try {
      const url = new URL(href, window.location.origin);
      if (url.hostname.toLowerCase() === 'zalo.me') eventName = 'click_zalo';
    } catch (_) { return; }
  }
  if (!eventName) return;
  const area = link.closest('header, main, footer');
  window.gtag('event', eventName, {
    contact_page: window.location.pathname,
    contact_area: area ? area.tagName.toLowerCase() : 'other',
    transport_type: 'beacon'
  });
});
