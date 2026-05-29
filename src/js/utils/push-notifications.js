/**
 * Notificaciones push inteligentes (Web Push API).
 * Usa Service Worker para enviar notificaciones locales sin backend.
 * Requiere consentimiento del usuario.
 */

const NOTIFICATION_CONSENT_KEY = 'elnino_notifications_consent';

/**
 * Verifica si las notificaciones están soportadas y permitidas.
 * @returns {boolean}
 */
export function areNotificationsSupported() {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Verifica si el usuario ha dado permiso para notificaciones.
 * @returns {boolean}
 */
export function hasNotificationPermission() {
  return Notification.permission === 'granted';
}

/**
 * Solicita permiso para notificaciones.
 * @returns {Promise<boolean>}
 */
export async function requestNotificationPermission() {
  if (!areNotificationsSupported()) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const permission = await Notification.requestPermission();
  localStorage.setItem(NOTIFICATION_CONSENT_KEY, permission === 'granted' ? '1' : '0');
  return permission === 'granted';
}

/**
 * Envía una notificación local inmediata.
 * @param {string} title
 * @param {object} options
 */
export function sendNotification(title, options = {}) {
  if (!hasNotificationPermission()) return;

  const defaultOptions = {
    body: '',
    icon: './icon-192.png',
    badge: './icon-192.png',
    tag: 'elnino-default',
    requireInteraction: false,
    data: {},
  };

  if (navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SHOW_NOTIFICATION',
      title,
      options: { ...defaultOptions, ...options },
    });
  } else {
    new Notification(title, { ...defaultOptions, ...options });
  }
}

/**
 * Programa notificaciones recurrentes (recordatorios de racha, misiones).
 * Usa setTimeout (no es persistente entre sesiones, pero funciona para demo).
 */
export function scheduleSmartNotifications() {
  if (!hasNotificationPermission()) return;

  // Recordatorio de racha (si no ha hecho login hoy)
  const now = new Date();
  const evening = new Date(now);
  evening.setHours(19, 0, 0, 0);
  if (evening > now) {
    setTimeout(() => {
      sendNotification('🔥 ¡No pierdas tu racha!', {
        body: 'Entra ahora y reclama tu recompensa diaria. Llevas varios días seguidos.',
        tag: 'streak-reminder',
      });
    }, evening - now);
  }

  // Recordatorio de misión diaria (mañana)
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  setTimeout(() => {
    sendNotification('🎯 Nueva misión diaria disponible', {
      body: 'Tus misiones diarias se han actualizado. Completa una y gana XP.',
      tag: 'daily-mission',
    });
  }, tomorrow - now);
}

/**
 * Notificación de bienvenida tras onboarding.
 */
export function sendWelcomeNotification(mascotName = 'tu mascota') {
  sendNotification('🚀 ¡Bienvenido a El Niño!', {
    body: `${mascotName} está emocionado de acompañarte en tus misiones. ¡Empieza a explorar!`,
    tag: 'welcome',
    requireInteraction: false,
  });
}
