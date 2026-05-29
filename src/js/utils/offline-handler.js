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

const MAX_RETRIES = 3;

/**
 * Procesa la cola offline con retry automático.
 * @param {function} processor - Función async que recibe cada acción, devuelve true si éxito
 * @returns {Promise<{success:number,failed:number}>}
 */
export async function processOfflineQueue(processor) {
  const queue = getOfflineQueue();
  if (queue.length === 0) return { success: 0, failed: 0 };

  const failed = [];
  let successCount = 0;

  for (const item of queue) {
    const retries = item.retries || 0;
    try {
      const ok = await processor(item);
      if (ok) {
        successCount++;
      } else {
        throw new Error('Processor returned false');
      }
    } catch {
      if (retries < MAX_RETRIES) {
        failed.push({ ...item, retries: retries + 1 });
      }
    }
  }

  // Guardar los que fallaron para reintentar después
  if (failed.length > 0) {
    try {
      localStorage.setItem(OFFLINE_KEY, JSON.stringify(failed));
    } catch {
      // Silencioso
    }
  } else {
    clearOfflineQueue();
  }

  return { success: successCount, failed: failed.length };
}

/**
 * Resolución de conflictos: última escritura gana (timestamp).
 * @param {object} local
 * @param {object} remote
 * @returns {object} el ganador
 */
export function resolveConflict(local, remote) {
  const localTime = local.timestamp || 0;
  const remoteTime = remote.timestamp || 0;
  return localTime >= remoteTime ? local : remote;
}

/**
 * Muestra un indicador de estado de sincronización.
 * @param {string} status - 'syncing' | 'synced' | 'error'
 * @param {string} message
 */
export function showSyncStatus(status, message = '') {
  let indicator = document.getElementById('syncIndicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'syncIndicator';
    indicator.style.cssText = 'position:fixed;bottom:80px;right:16px;z-index:9998;padding:8px 14px;border-radius:12px;font-size:0.8rem;font-weight:600;transition:all 0.3s ease;opacity:0;transform:translateY(10px);';
    document.body.appendChild(indicator);
  }

  const styles = {
    syncing: 'background:rgba(0,245,255,0.2);color:var(--primary);border:1px solid rgba(0,245,255,0.3);',
    synced: 'background:rgba(124,255,107,0.2);color:var(--success);border:1px solid rgba(124,255,107,0.3);',
    error: 'background:rgba(255,49,90,0.2);color:var(--danger);border:1px solid rgba(255,49,90,0.3);',
  };

  indicator.style.cssText += styles[status] || styles.syncing;
  indicator.textContent = message || { syncing: '📡 Sincronizando...', synced: '✅ Sincronizado', error: '❌ Error de sync' }[status];
  indicator.style.opacity = '1';
  indicator.style.transform = 'translateY(0)';

  if (status !== 'syncing') {
    setTimeout(() => {
      indicator.style.opacity = '0';
      indicator.style.transform = 'translateY(10px)';
    }, 3000);
  }
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
