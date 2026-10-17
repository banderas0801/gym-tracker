const CACHE_NAME = 'gymtracker-v2';

// Tài nguyên core cần cache ngay khi install
const PRECACHE_URLS = [
  '/',
  '/manifest.webmanifest',
];

// Install: Cache app shell & skip waiting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate: Xóa sạch cache cũ (v1, ...) & chiếm quyền điều khiển client ngay
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Strategy:
// 1. Navigation / Document (HTML trang chính): Network-First, fallback to Cache khi offline
//    -> Giúp App đã cài PWA luôn tải ngay giao diện mới nhất khi có mạng, không bị kẹt giao diện cũ!
// 2. Ảnh bài tập từ CDN: Cache-First
// 3. Static JS/CSS: Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Bỏ qua các request không phải GET hoặc không phải http(s)
  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // 1. Navigation / HTML trang chủ: NETWORK-FIRST (Luôn ưu tiên nạp bản mới nhất)
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Khi offline -> trả về cache
          return caches.match(request).then((cached) => cached || caches.match('/'));
        })
    );
    return;
  }

  // 2. Exercise images từ GitHub CDN: Cache-first (ảnh không thay đổi)
  if (url.hostname === 'raw.githubusercontent.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          }).catch(() => {
            return new Response('', { status: 408, statusText: 'Offline' });
          });
        });
      })
    );
    return;
  }

  // 3. Static assets (JS, CSS, Font, Next chunk): Stale-While-Revalidate
  if (
    url.origin === self.location.origin &&
    (request.destination === 'script' ||
     request.destination === 'style' ||
     request.destination === 'font' ||
     request.destination === 'image' ||
     url.pathname.startsWith('/_next/'))
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cached) => {
          const fetchPromise = fetch(request)
            .then((response) => {
              if (response.ok) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => cached);

          return cached || fetchPromise;
        });
      })
    );
    return;
  }
});
