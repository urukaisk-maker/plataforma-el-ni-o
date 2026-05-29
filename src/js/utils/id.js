/**
 * Generador de IDs únicos sin dependencias externas.
 */

let counter = 0;

/**
 * Genera un ID único basado en timestamp y contador.
 * @param {string} prefix
 * @returns {string}
 */
export function generateId(prefix = 'id') {
  counter = (counter + 1) % 1_000_000;
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Genera un ID corto para uso interno.
 * @returns {string}
 */
export function generateShortId() {
  return Math.random().toString(36).slice(2, 11);
}
