/**
 * Utilidades de validación y sanitización de datos.
 * Previene XSS y normaliza entradas de usuario.
 */

const FORBIDDEN_TAGS = /<script|<iframe|<object|<embed|<link|<style|<meta|<base/i;

/**
 * Escapa caracteres HTML para prevenir inyección XSS.
 * @param {string} text
 * @returns {string}
 */
export function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitiza texto de entrada de usuario.
 * - Elimina etiquetas prohibidas
 * - Escapa HTML restante
 * - Limita longitud
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function sanitizeText(text, maxLength = 1000) {
  if (typeof text !== 'string') return '';
  let cleaned = text.trim();
  if (FORBIDDEN_TAGS.test(cleaned)) {
    cleaned = cleaned.replace(/<[^>]+>/g, '');
  }
  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength);
  }
  return escapeHtml(cleaned);
}

/**
 * Valida que un array de etiquetas sea válido.
 * @param {Array} tags
 * @param {number} maxTags
 * @param {number} maxLength
 * @returns {string[]}
 */
export function sanitizeTags(tags, maxTags = 5, maxLength = 20) {
  if (!Array.isArray(tags)) return [];
  return tags
    .filter(t => typeof t === 'string')
    .map(t => t.trim().toLowerCase().slice(0, maxLength))
    .filter(t => t.length > 0)
    .slice(0, maxTags);
}

/**
 * Valida una URL de imagen (solo http/https).
 * @param {string} url
 * @returns {boolean}
 */
export function isValidImageUrl(url) {
  if (typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Valida que una cadena no esté vacía.
 * @param {string} value
 * @returns {boolean}
 */
export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}
