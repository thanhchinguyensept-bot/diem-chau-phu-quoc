(() => {
  const button = document.querySelector('.mobile-menu-toggle');
  const panel = document.getElementById('mobile-menu-panel');
  if (!button || !panel) return;
  button.addEventListener('click', () => {
    const open = panel.hidden;
    panel.hidden = !open;
    panel.style.setProperty('display', open ? 'grid' : 'none', 'important');
    panel.style.setProperty('grid-template-columns', '1fr', 'important');
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  });
})();
