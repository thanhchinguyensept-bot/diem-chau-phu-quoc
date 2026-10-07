// sw.js – Service Worker cho Diem Chau Phu Quoc PWA
const CACHE_NAME = 'diemchau-pwa-v1';

// Danh sách các tài nguyên tĩnh cốt lõi cần cache ngay khi cài đặt
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './rooms.html',
  './booking.html',
  './smart-pass.html',
  './contact.html',
  './blog.html',
  './offline.html',
  './manifest.json',
  './js/common.js',
  './images/logo-diemchau.png',
  './images/logo-diemchau-light.png',
  './images/logo-diemchau-dark.png',
  './images/icon-192.png',
  './images/icon-512.png',
  './images/icon-512-maskable.png'
];

// Cài đặt Service Worker và Pre-cache các trang cốt lõi
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Kích hoạt Service Worker và dọn dẹp cache cũ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Chiến lược Fetch:
// - Với API hoặc backend request: Network first, không can thiệp lỗi
// - Với trang & tài nguyên tĩnh: Stale-While-Revalidate hoặc Network-first với fallback sang Cache/Offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Không cache API hoặc external analytics / POST requests
  if (request.method !== 'GET' || url.pathname.startsWith('/api/')) {
    return;
  }

  // Đối với điều hướng trang HTML (Navigation Request)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Lưu bản sao vào cache để lần sau xem offline
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(async () => {
          // Mất mạng: Trả về trang từ cache nếu có, nếu chưa từng cache thì trả về offline.html
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          return caches.match('./offline.html');
        })
    );
    return;
  }

  // Đối với tài nguyên tĩnh (Images, CSS, JS, Fonts): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse); // Nếu mạng lỗi, giữ nguyên cache

      return cachedResponse || fetchPromise;
    })
  );
});
