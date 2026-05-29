/**
 * Servicio de historial de actividad.
 * Genera un timeline a partir de los datos existentes en localStorage.
 */

import { getSocialData } from './social-service.js';
import { getGamificationData } from './gamification-service.js';

const ACTIVITY_LOG_KEY = 'elnino_activity_log';

/**
 * Registra un evento en el log de actividad.
 * @param {string} type - Tipo de evento: 'mission', 'photo', 'chat', 'badge', 'login', 'video', 'music'
 * @param {string} title
 * @param {string} description
 * @param {number} xp
 */
export function logActivity(type, title, description, xp = 0) {
  const log = getActivityLog();
  log.push({
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    title,
    description,
    xp,
    timestamp: new Date().toISOString(),
  });
  // Mantener máximo 200 eventos
  if (log.length > 200) log.splice(0, log.length - 200);
  try {
    localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(log));
  } catch {
    // Silencioso
  }
}

/**
 * Obtiene el log de actividad crudo.
 * @returns {Array}
 */
export function getActivityLog() {
  try {
    const raw = localStorage.getItem(ACTIVITY_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Genera un timeline combinando el log explícito + datos inferidos de otros servicios.
 * @param {number} limit
 * @returns {Array} eventos ordenados por fecha descendente
 */
export function getTimeline(limit = 50) {
  const events = [...getActivityLog()];

  // Inferir eventos de fotos
  try {
    const social = getSocialData();
    social.photos?.forEach(photo => {
      events.push({
        type: 'photo',
        title: 'Foto subida',
        description: photo.caption || 'Sin descripción',
        timestamp: photo.timestamp || new Date().toISOString(),
        meta: { url: photo.url },
      });
    });
  } catch {
    // Ignorar
  }

  // Inferir eventos de mensajes
  try {
    const social = getSocialData();
    social.messages?.forEach(msg => {
      events.push({
        type: 'chat',
        title: 'Mensaje en chat',
        description: msg.content?.slice(0, 60) || '',
        timestamp: msg.timestamp || new Date().toISOString(),
        meta: { author: msg.authorName },
      });
    });
  } catch {
    // Ignorar
  }

  // Inferir eventos de comentarios
  try {
    const social = getSocialData();
    social.comments?.forEach(c => {
      events.push({
        type: 'comment',
        title: 'Comentario añadido',
        description: c.content?.slice(0, 60) || '',
        timestamp: c.timestamp || new Date().toISOString(),
        meta: { author: c.authorName },
      });
    });
  } catch {
    // Ignorar
  }

  // Login más reciente
  try {
    const gamification = getGamificationData();
    const player = gamification.players?.[0];
    if (player?.lastLogin) {
      events.push({
        type: 'login',
        title: 'Inicio de sesión',
        description: `Racha actual: ${player.dailyStreak || 0} días`,
        timestamp: new Date(player.lastLogin).toISOString(),
      });
    }
  } catch {
    // Ignorar
  }

  // Ordenar por fecha descendente y eliminar duplicados por id/timestamp+type+title
  const seen = new Set();
  const unique = [];
  events
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .forEach(evt => {
      const key = `${evt.type}_${evt.title}_${evt.timestamp}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(evt);
      }
    });

  return unique.slice(0, limit);
}

/**
 * Obtiene resumen de estadísticas para el timeline.
 */
export function getActivitySummary() {
  try {
    const social = getSocialData();
    const gamification = getGamificationData();
    const player = gamification.players?.[0];

    return {
      totalPhotos: social.photos?.length || 0,
      totalMessages: social.messages?.length || 0,
      totalComments: social.comments?.length || 0,
      completedMissions: player?.completedMissions || 0,
      xp: player?.xp || 0,
      level: player?.level || 1,
      streak: player?.dailyStreak || 0,
      badges: player?.badges?.length || 0,
    };
  } catch {
    return {
      totalPhotos: 0,
      totalMessages: 0,
      totalComments: 0,
      completedMissions: 0,
      xp: 0,
      level: 1,
      streak: 0,
      badges: 0,
    };
  }
}
