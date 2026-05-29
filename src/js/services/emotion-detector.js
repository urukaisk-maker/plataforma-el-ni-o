/**
 * Detección de emociones en el aprendizaje.
 * Analiza patrones locales (errores, tiempo, rachas) para identificar
 * frustración, aburrimiento o dominio — sin IA externa, solo lógica inteligente.
 */

import { logActivity } from './activity-service.js';

const EMOTION_LOG_KEY = 'elnino_emotion_log';

/**
 * Detecta el estado emocional del jugador basado en sesión reciente.
 * @param {object} session — { errors, total, timeSpentMs, consecutiveFails, avgTimePerQuestion }
 * @returns {object} { emotion, confidence, suggestion, tone }
 */
export function detectEmotion(session) {
  const { errors, total, timeSpentMs, consecutiveFails } = session;
  const errorRate = total > 0 ? errors / total : 0;
  const avgTime = total > 0 ? timeSpentMs / total : 0;

  // Frustración: muchos errores seguidos, tiempo corto (clicks rápidos sin pensar)
  if (consecutiveFails >= 3 || (errorRate > 0.7 && total >= 3)) {
    logEmotion('frustrated', session);
    return {
      emotion: 'frustrated',
      label: 'Frustración detectada',
      confidence: Math.min(0.95, 0.6 + errorRate * 0.3),
      suggestion: 'Parece que esto se complicó. ¿Quieres que te dé una pista o cambiemos a algo más fácil?',
      tone: 'calm',
      color: '#ff6b6b',
    };
  }

  // Aburrimiento: todo correcto pero muy rápido (menos de 3s por pregunta)
  if (errorRate < 0.1 && total >= 5 && avgTime < 3000) {
    logEmotion('bored', session);
    return {
      emotion: 'bored',
      label: 'Posible aburrimiento',
      confidence: 0.75,
      suggestion: '¡Vas volando! ¿Te atreves con preguntas más difíciles?',
      tone: 'excited',
      color: '#ffe45c',
    };
  }

  // Dominio: todo correcto, tiempo razonable, racha buena
  if (errorRate < 0.2 && total >= 5 && avgTime >= 3000) {
    logEmotion('mastering', session);
    return {
      emotion: 'mastering',
      label: 'Dominio del tema',
      confidence: 0.9,
      suggestion: '¡Estás dominando esto! Prepárate para el siguiente nivel.',
      tone: 'celebratory',
      color: '#7cff6b',
    };
  }

  // Neutral: estado intermedio
  logEmotion('neutral', session);
  return {
    emotion: 'neutral',
    label: 'Progreso estable',
    confidence: 0.5,
    suggestion: 'Sigues adelante. Cada pregunta te acerca a la meta.',
    tone: 'encouraging',
    color: '#00f5ff',
  };
}

function logEmotion(emotion, session) {
  const log = getEmotionLog();
  log.push({
    emotion,
    timestamp: Date.now(),
    session,
  });
  if (log.length > 100) log.splice(0, log.length - 100);
  try {
    localStorage.setItem(EMOTION_LOG_KEY, JSON.stringify(log));
  } catch {
    // Silencioso
  }

  logActivity('emotion', `Estado: ${emotion}`, `Error rate: ${(session.errors / Math.max(session.total, 1)).toFixed(2)}`);
}

function getEmotionLog() {
  try {
    const raw = localStorage.getItem(EMOTION_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Obtiene el historial de emociones para el reporte semanal.
 * @param {number} days — últimos N días
 */
export function getEmotionHistory(days = 7) {
  const log = getEmotionLog();
  const cutoff = Date.now() - days * 86400000;
  return log.filter(e => e.timestamp > cutoff);
}

/**
 * Calcula distribución de emociones en un período.
 */
export function getEmotionDistribution(days = 7) {
  const history = getEmotionHistory(days);
  const dist = {};
  history.forEach(e => {
    dist[e.emotion] = (dist[e.emotion] || 0) + 1;
  });
  return dist;
}
