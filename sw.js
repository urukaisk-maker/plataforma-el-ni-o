// Service Worker para PWA - Modo offline y caché
const STATIC_CACHE = 'elnino-static-v2';
const DYNAMIC_CACHE = 'elnino-dynamic-v2';

// Recursos estáticos para cachear
const STATIC_ASSETS = [
  './',
  './index.html',
  './misiones.html',
  './mision-01.html',
  './mision-02.html',
  './mision-03.html',
  './youtube.html',
  './peliculas.html',
  './recuerdos.html',
  './sorpresa.html',
  './final-epico.html',
  './celebracion.html',
  './regalo-digital.html',
  './rincon-gamer.html',
  './ceremonia-digital.html',
  './recompensas.html',
  './premio-sorpresa.html',
  './leaderboard.html',
  './perfil.html',
  './insignias.html',
  './chat.html',
  './galeria.html',
  './personalizacion.html',
  './creador-misiones.html',
  './tarjetas.html',
  './proyecto.html',
  './cookies.html',
  './privacidad.html',
  './terminos.html',
  './src/styles/main.css',
  './src/js/app.js',
  './favicon.svg',
  './icon-192.png',
  './icon-512.png',
  './manifest.json'
];

// Instalación del service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activación del service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia de caché: Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar solicitudes no-GET
  if (request.method !== 'GET') return;

  // Ignorar solicitudes a otros dominios (excepto YouTube e imágenes)
  if (url.origin !== location.origin && !url.hostname.includes('youtube.com') && !url.hostname.includes('ytimg.com')) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Devolver respuesta cachetada y actualizar en segundo plano
        fetchAndCache(request);
        return cachedResponse;
      }

      // Si no está en caché, hacer la solicitud
      return fetchAndCache(request);
    })
  );
});

// Función para hacer fetch y cachear
function fetchAndCache(request) {
  return fetch(request).then((response) => {
    // Verificar si la respuesta es válida
    if (!response || response.status !== 200 || response.type !== 'basic') {
      return response;
    }

    // Clonar la respuesta para poder cachearla
    const responseToCache = response.clone();

    caches.open(DYNAMIC_CACHE).then((cache) => {
      cache.put(request, responseToCache);
    });

    return response;
  }).catch(() => {
    // Si falla el fetch, intentar servir desde caché estático
    return caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // Si es una solicitud de página HTML, servir la página offline
      if (request.headers.get('accept').includes('text/html')) {
        return caches.match('./index.html');
      }

      return new Response('Offline - No hay conexión', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'text/plain'
        })
      });
    });
  });
}

// Sincronización en segundo plano (para cuando se implemente backup en la nube)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Función para sincronizar datos (placeholder para futura implementación)
async function syncData() {
  // Aquí se implementaría la sincronización con la nube
  console.log('Sincronizando datos con la nube...');
}

// Manejo de notificaciones push (placeholder para futura implementación)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación de El Niño',
    icon: './favicon.svg',
    badge: './favicon.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('El Niño', options)
  );
});

// Manejo de clic en notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('./index.html')
  );
});
