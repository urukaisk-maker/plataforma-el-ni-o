/**
 * Analytics básico frontend.
 * Rastrea visitas de página y eventos de interacción sin cookies de terceros.
 * Los datos se guardan en localStorage para privacidad del usuario.
 */

const ANALYTICS_KEY = 'elnino_analytics';

/**
 * Registra una vista de página.
 * @param {string} pageName
 */
export function trackPageView(pageName = document.title) {
  const data = getAnalyticsData();
  data.pageViews.push({
    page: pageName,
    url: window.location.pathname,
    timestamp: Date.now(),
  });
  // Limitar a últimas 100 vistas
  if (data.pageViews.length > 100) {
    data.pageViews = data.pageViews.slice(-100);
  }
  data.totalVisits = (data.totalVisits || 0) + 1;
  saveAnalyticsData(data);
}

/**
 * Registra un evento de interacción.
 * @param {string} category - 'mission', 'photo', 'chat', 'music', etc.
 * @param {string} action - 'click', 'complete', 'upload', etc.
 * @param {string} label - detalle opcional
 */
export function trackEvent(category, action, label = '') {
  const data = getAnalyticsData();
  data.events.push({
    category,
    action,
    label,
    timestamp: Date.now(),
  });
  if (data.events.length > 200) {
    data.events = data.events.slice(-200);
  }
  saveAnalyticsData(data);
}

/**
 * Obtiene todas las estadísticas acumuladas.
 * @returns {object}
 */
export function getAnalyticsData() {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Silencioso
  }
  return {
    firstVisit: Date.now(),
    totalVisits: 0,
    pageViews: [],
    events: [],
  };
}

function saveAnalyticsData(data) {
  try {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
  } catch {
    // Silencioso
  }
}

/**
 * Genera un resumen legible de las estadísticas.
 * @returns {object}
 */
export function getAnalyticsSummary() {
  const data = getAnalyticsData();
  const now = Date.now();
  const oneDay = 86400000;

  const todayViews = data.pageViews.filter(v => now - v.timestamp < oneDay).length;
  const weekViews = data.pageViews.filter(v => now - v.timestamp < oneDay * 7).length;

  const topPages = {};
  data.pageViews.forEach(v => {
    topPages[v.page] = (topPages[v.page] || 0) + 1;
  });

  const topEvents = {};
  data.events.forEach(e => {
    const key = `${e.category}:${e.action}`;
    topEvents[key] = (topEvents[key] || 0) + 1;
  });

  return {
    totalVisits: data.totalVisits,
    todayViews,
    weekViews,
    totalPageViews: data.pageViews.length,
    totalEvents: data.events.length,
    topPages: Object.entries(topPages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5),
    topEvents: Object.entries(topEvents)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5),
  };
}
