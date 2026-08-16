const CACHE_NAME = 'zoo-calc-paused'; // временная приостановка работы, было v1.2.3 (zoo-calc-v3)
const ASSETS = [
  'index.html',
  'manifest.json',
  'rat.jpg',
  'mouse.jpg',
  'icon-192.png',
  'icon-512.png'
];

// Установка: кешируем все ресурсы и сразу активируем новую версию SW,
// не дожидаясь закрытия всех открытых вкладок/сворачиваний приложения
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Активация: очистка старых кешей + немедленный захват уже открытых страниц,
// чтобы обновление применилось сразу, без ручной перезагрузки
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Стратегия: сначала кеш, потом сеть
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});