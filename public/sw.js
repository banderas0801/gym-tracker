const CACHE_NAME = 'gymtracker-v1';

// Tài nguyên core cần cache ngay khi install
const PRECACHE_URLS = [
  '/',
  '/manifest.webmanifest',
];

// Install: Cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  // Kích hoạt ngay, không chờ tab cũ đóng
  self.skipWaiting();
});

// Activate: Xóa cache cũ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  // Chiếm quyền điều khiển tất cả các tab
  self.clients.claim();
});

// Fetch: Stale-While-Revalidate cho navigation & static assets
// Network-first cho exercise images (CDN), Cache-first cho JS/CSS/fonts
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Bỏ qua các request không phải GET
  if (request.method !== 'GET') return;

  // Bỏ qua Chrome extensions & non-http
  if (!url.protocol.startsWith('http')) return;

  // Exercise images từ GitHub CDN: Cache-first (ảnh không đổi)
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
            // Offline fallback: trả về response rỗng cho ảnh
            return new Response('', { status: 408, statusText: 'Offline' });
          });
        });
      })
    );
    return;
  }

  // App shell & static assets: Stale-While-Revalidate
  if (
    url.origin === self.location.origin &&
    (request.destination === 'document' ||
     request.destination === 'script' ||
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
            .catch(() => cached); // Offline: trả cached version

          // Trả cached ngay (nhanh), đồng thời cập nhật cache nền
          return cached || fetchPromise;
        });
      })
    );
    return;
  }
});
