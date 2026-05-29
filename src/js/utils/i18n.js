/**
 * Sistema de internacionalizacion (i18n) ligero para vanilla JS.
 * Soporta: interpolacion, plurales, fechas relativas, carga dinamica.
 */

const I18N_KEY = 'elnino_locale';
const DEFAULT_LOCALE = 'es';

const LOCALES = {
  es: { label: 'Espanol', flag: '🇪🇸', dir: 'ltr' },
  'es-MX': { label: 'Espanol (Mexico)', flag: '🇲🇽', dir: 'ltr' },
  'es-AR': { label: 'Espanol (Argentina)', flag: '🇦🇷', dir: 'ltr' },
  'es-CO': { label: 'Espanol (Colombia)', flag: '🇨🇴', dir: 'ltr' },
  en: { label: 'English', flag: '🇺🇸', dir: 'ltr' },
  'en-GB': { label: 'English (UK)', flag: '🇬🇧', dir: 'ltr' },
  pt: { label: 'Portugues', flag: '🇵🇹', dir: 'ltr' },
  'pt-BR': { label: 'Portugues (Brasil)', flag: '🇧🇷', dir: 'ltr' },
};

let currentLocale = DEFAULT_LOCALE;
let translations = {};

/**
 * Obtiene el locale guardado o el default.
 */
export function getSavedLocale() {
  try {
    const saved = localStorage.getItem(I18N_KEY);
    return saved && LOCALES[saved] ? saved : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

/**
 * Carga las traducciones para un locale.
 */
export async function loadLocale(locale) {
  if (!LOCALES[locale]) locale = DEFAULT_LOCALE;
  try {
    const module = await import(`../locales/${locale}.js`);
    translations = module.default || module;
    currentLocale = locale;
    localStorage.setItem(I18N_KEY, locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = LOCALES[locale].dir;
    return true;
  } catch {
    // Fallback a es si falla la carga
    if (locale !== 'es') {
      const fallback = await import('../locales/es.js');
      translations = fallback.default || fallback;
      currentLocale = 'es';
    }
    return false;
  }
}

/**
 * Traduce una clave con interpolacion opcional.
 * @param {string} key — clave anidada tipo 'nav.home'
 * @param {object} params — valores a interpolar
 */
export function t(key, params = {}) {
  const value = key.split('.').reduce((obj, k) => obj?.[k], translations);
  if (typeof value !== 'string') return key;

  return value.replace(/\{\{(\w+)\}\}/g, (_, name) => {
    return params[name] !== undefined ? String(params[name]) : `{{${name}}}`;
  });
}

/**
 * Traduce con soporte de plural.
 * @param {string} key — clave base
 * @param {number} count — cantidad
 * @param {object} params — otros parametros
 */
export function tn(key, count, params = {}) {
  const base = translations[key];
  if (!base) return key;

  const form = count === 0 ? 'zero' : count === 1 ? 'one' : 'other';
  const template = base[form] || base.other || base.one || key;

  return template.replace(/\{\{(\w+)\}\}/g, (_, name) => {
    if (name === 'count') return String(count);
    return params[name] !== undefined ? String(params[name]) : `{{${name}}}`;
  });
}

/**
 * Formatea una fecha segun el locale actual.
 */
export function formatDate(date, options = {}) {
  const d = date instanceof Date ? date : new Date(date);
  const opts = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  try {
    return new Intl.DateTimeFormat(currentLocale, opts).format(d);
  } catch {
    return d.toLocaleDateString();
  }
}

/**
 * Formatea una fecha relativa (hace X minutos, etc.).
 */
export function formatRelativeDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const r = translations?.relative;
  if (!r) return d.toLocaleDateString();

  if (diffSec < 60) return r.justNow;
  if (diffMin < 60) return tn('relative.minutesAgo', diffMin);
  if (diffHour < 24) return tn('relative.hoursAgo', diffHour);
  if (diffDay < 7) return tn('relative.daysAgo', diffDay);
  return formatDate(d);
}

/**
 * Formatea un numero con separadores de miles/decimales locales.
 */
export function formatNumber(num, options = {}) {
  try {
    return new Intl.NumberFormat(currentLocale, options).format(num);
  } catch {
    return String(num);
  }
}

/**
 * Obtiene la lista de locales disponibles.
 */
export function getAvailableLocales() {
  return Object.entries(LOCALES).map(([code, info]) => ({ code, ...info }));
}

/**
 * Obtiene el locale actual.
 */
export function getCurrentLocale() {
  return currentLocale;
}

/**
 * Inicializa i18n con el locale guardado.
 */
export async function initI18n() {
  const locale = getSavedLocale();
  await loadLocale(locale);
}
