// sw.js - Service Worker para el Blog Manager PWA

const CACHE_NAME = 'blog-manager-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker instalándose');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker activándose');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de caching: Cache First para recursos estáticos
self.addEventListener('fetch', event => {
  // Solo manejar peticiones GET
  if (event.request.method !== 'GET') return;
  
  // Para recursos estáticos, usar estrategia Cache First
  if (STATIC_CACHE_URLS.some(url => event.request.url.includes(url))) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Si está en caché, devolverla
          if (response) {
            return response;
          }
          
          // Si no está en caché, hacer la petición y guardar en caché
          return fetch(event.request)
            .then(response => {
              // Verificar que la respuesta es válida
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // Clonar la respuesta para guardar en caché
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
              
              return response;
            });
        })
    );
  }
  
  // Para imágenes, usar estrategia Cache First con fallback a red
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          
          return fetch(event.request)
            .then(response => {
              if (!response || response.status !== 200) {
                return response;
              }
              
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
              
              return response;
            })
            .catch(() => {
              // En caso de error, devolver una imagen placeholder
              return new Response(
                '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#ccc">Imagen no disponible</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            });
        })
    );
  }
  
  // Para datos de la API, usar estrategia Network First con fallback a caché
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Si la respuesta es exitosa, guardar en caché
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
          }
          
          return response;
        })
        .catch(() => {
          // Si falla la red, intentar servir desde caché
          return caches.match(event.request);
        })
    );
  }
});