/**
 * Gestión del estado de conexión y sincronización offline.
 */

const OFFLINE_KEY = 'elnino_offline_queue';

/**
 * Verifica si hay conexión a internet.
 * @returns {boolean}
 */
export function isOnline() {
  return navigator.onLine;
}

/**
 * Registra un callback para cambios de estado de red.
 * @param {function} onOnline
 * @param {function} onOffline
 */
export function registerNetworkListeners(onOnline, onOffline) {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

/**
 * Añade una acción a la cola offline para sincronizar después.
 * @param {string} action
 * @param {object} payload
 */
export function queueOfflineAction(action, payload) {
  const queue = getOfflineQueue();
  queue.push({ action, payload, timestamp: Date.now() });
  try {
    localStorage.setItem(OFFLINE_KEY, JSON.stringify(queue));
  } catch {
    // Silencioso
  }
}

/**
 * Obtiene la cola de acciones pendientes.
 * @returns {Array}
 */
export function getOfflineQueue() {
  try {
    const raw = localStorage.getItem(OFFLINE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Limpia la cola offline.
 */
export function clearOfflineQueue() {
  try {
    localStorage.removeItem(OFFLINE_KEY);
  } catch {
    // Silencioso
  }
}

/**
 * Procesa la cola offline (ejecutar cuando vuelve la conexión).
 * @param {function} processor - Función que recibe cada acción
 */
export function processOfflineQueue(processor) {
  const queue = getOfflineQueue();
  if (queue.length === 0) return;

  queue.forEach(item => {
    try {
      processor(item);
    } catch {
      // Ignorar errores individuales
    }
  });

  clearOfflineQueue();
}

/**
 * Muestra u oculta la pantalla de offline.
 * @param {boolean} show
 */
export function toggleOfflineScreen(show) {
  let screen = document.getElementById('offlineScreen');
  if (!screen) {
    screen = document.createElement('div');
    screen.id = 'offlineScreen';
    screen.className = 'offline-screen';
    screen.setAttribute('role', 'alert');
    screen.setAttribute('aria-live', 'polite');
    screen.innerHTML = `
      <div class="offline-screen__content">
        <span class="offline-screen__icon">📡</span>
        <h2>Sin conexión</h2>
        <p>Puedes seguir usando la app. Los cambios se guardarán localmente.</p>
        <button class="button button--primary" id="offlineRetryBtn">Reintentar</button>
      </div>
    `;
    document.body.appendChild(screen);

    document.getElementById('offlineRetryBtn')?.addEventListener('click', () => {
      if (navigator.onLine) {
        toggleOfflineScreen(false);
        window.location.reload();
      }
    });
  }

  screen.style.display = show ? 'flex' : 'none';
}
