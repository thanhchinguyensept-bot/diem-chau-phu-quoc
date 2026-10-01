// common.js – shared utilities for Diễm Châu website

// Toggle mobile menu
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('hidden');
}

// Language toggle (VN/EN)
let currentLang = localStorage.getItem('lang') || 'vi';
function toggleLang() {
  currentLang = currentLang === 'vi' ? 'en' : 'vi';
  localStorage.setItem('lang', currentLang);
  document.getElementById('lang-label').textContent = currentLang === 'vi' ? '🌐 VN' : '🌐 EN';
  // Update all elements with data-lang attributes
  document.querySelectorAll('[data-lang-vi]').forEach(el => {
    el.textContent = el.getAttribute('data-lang-' + currentLang);
  });
}
// Apply saved language on load
document.addEventListener('DOMContentLoaded', () => {
  if (currentLang !== 'vi') toggleLang();
});

// Simple step navigation for booking flow
let bookingStep = 1;
function goToStep(step) {
  document.querySelectorAll('.booking-step').forEach(el => el.classList.add('hidden'));
  const target = document.getElementById('step' + step);
  if (target) target.classList.remove('hidden');
  bookingStep = step;
}
function nextStep() { if (bookingStep < 7) goToStep(bookingStep + 1); }
function prevStep() { if (bookingStep > 1) goToStep(bookingStep - 1); }
