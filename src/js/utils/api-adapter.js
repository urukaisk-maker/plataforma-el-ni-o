/**
 * Adaptador de storage abstracto.
 * Permite cambiar entre localStorage (actual) y API remota (futura)
 * sin modificar los servicios de datos.
 *
 * Uso actual: localStorage (modo 'local')
 * Futuro: cambiar MODE a 'api' y proveer fetchFn.
 */

const MODE = 'local'; // 'local' | 'api'

/**
 * Obtiene un valor del storage activo.
 * @param {string} key
 * @param {*} fallback
 * @returns {Promise<*>}
 */
export async function get(key, fallback = null) {
  if (MODE === 'local') {
    return getLocal(key, fallback);
  }
  // Futuro: llamada a API
  throw new Error('API mode not implemented yet');
}

/**
 * Guarda un valor en el storage activo.
 * @param {string} key
 * @param {*} value
 * @returns {Promise<boolean>}
 */
export async function set(key, value) {
  if (MODE === 'local') {
    return setLocal(key, value);
  }
  throw new Error('API mode not implemented yet');
}

/**
 * Elimina una clave del storage activo.
 * @param {string} key
 * @returns {Promise<boolean>}
 */
export async function remove(key) {
  if (MODE === 'local') {
    return removeLocal(key);
  }
  throw new Error('API mode not implemented yet');
}

// ==================== LOCAL IMPLEMENTATION ====================

function getLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function removeLocal(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Devuelve el modo actual del adaptador.
 * Útil para debugging y feature flags.
 * @returns {string}
 */
export function getMode() {
  return MODE;
}
