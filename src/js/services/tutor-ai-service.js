/**
 * Tutor IA conversacional — Stub local con lógica inteligente.
 * Diseñado para integrar Whisper (STT) + OpenAI (chat) + Web Speech API (TTS).
 * Sin API key funciona en modo demo con respuestas predefinidas.
 */

import { speak } from '../utils/speech.js';
import { logActivity } from './activity-service.js';

const TUTOR_KEY = 'elnino_tutor_history';
const TUTOR_ENABLED_KEY = 'elnino_tutor_enabled';

const PERSONALITIES = {
  drako: { name: 'Drako', emoji: '🐉', tone: 'valiente y energético' },
  robi: { name: 'Robi', emoji: '🤖', tone: 'lógico y curioso' },
  michi: { name: 'Michi', emoji: '🐱', tone: 'amable y paciente' },
  zork: { name: 'Zork', emoji: '👽', tone: 'misterioso y divertido' },
};

/**
 * Respuestas demo por categoría (modo stub sin API).
 * En producción esto se reemplaza por llamada a OpenAI/Claude.
 */
const DEMO_RESPONSES = {
  matematicas: [
    '¡Las matemáticas son como un juego de puzles! ¿Sabías que el número 0 fue inventado en la India?',
    'Para sumar con llevada, imagina que estás juntando monedas en una alcancía. ¡Cada 10 monedas hacen una moneda grande!',
    'Las restas son como devolver caramelos prestados. Si tienes 5 y devuelves 2, ¿cuántos te quedan?',
  ],
  historia: [
    '¡La historia está llena de aventuras! ¿Sabías que Cleopatra vivió más cerca de la llegada a la Luna que de la construcción de las pirámides?',
    'Los romanos inventaron los caminos pavimentados. ¡Algunos todavía existen hoy!',
  ],
  ciencia: [
    '¡La ciencia es mágica pero real! Un rayo es 5 veces más caliente que la superficie del Sol.',
    'Las abejas pueden ver colores que nosotros no podemos, como el ultravioleta. ¡Las flores les brillan como neones!',
  ],
  motivacion: [
    '¡Estás haciendo un trabajo increíble! Cada error es una pista secreta para resolver el siguiente nivel.',
    'Recuerda: ¡todos los grandes héroes empezaron como principiantes! Tú estás en el camino correcto.',
    '¡No te rindas! Los cerebros más brillantes del mundo cometieron miles de errores antes de acertar.',
  ],
  default: [
    '¡Hola! Soy tu tutor personal. ¿En qué tema te gustaría que te ayude hoy?',
    'Puedo explicarte matemáticas, historia, ciencia o simplemente darte ánimos. ¿Qué prefieres?',
    '¡Estoy aquí para ayudarte! Pregúntame lo que quieras o dime si necesitas una pista.',
  ],
};

function getHistory() {
  try {
    const raw = localStorage.getItem(TUTOR_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(TUTOR_KEY, JSON.stringify(history.slice(-50)));
  } catch {
    // Silencioso
  }
}

/**
 * Detecta la categoría de una pregunta del usuario.
 * En producción esto lo haría un LLM.
 */
function detectCategory(text) {
  const t = text.toLowerCase();
  if (/suma|resta|multiplica|divide|número|mate|calcular|más|menos|x|÷/.test(t)) return 'matematicas';
  if (/historia|rey|guerra|imperio|año|siglo|antiguo|romano|egipcio/.test(t)) return 'historia';
  if (/ciencia|planeta|animal|planta|agua|fuego|tierra|espacio|estrella/.test(t)) return 'ciencia';
  if (/ánimo|triste|difícil|no puedo|ayuda|frustrado|aburrido|ánimos/.test(t)) return 'motivacion';
  return 'default';
}

/**
 * Genera una respuesta del tutor.
 * Stub local — en producción llamar a OpenAI API.
 */
export async function askTutor(question, personalityId = 'drako') {
  const personality = PERSONALITIES[personalityId] || PERSONALITIES.drako;
  const history = getHistory();

  // Guardar pregunta del usuario
  history.push({
    role: 'user',
    content: question,
    timestamp: Date.now(),
  });

  // Generar respuesta demo
  const category = detectCategory(question);
  const responses = DEMO_RESPONSES[category] || DEMO_RESPONSES.default;
  const responseText = responses[Math.floor(Math.random() * responses.length)];

  // Añadir toque de personalidad
  const prefixed = `${personality.emoji} ${personality.name}: ${responseText}`;

  history.push({
    role: 'assistant',
    content: prefixed,
    timestamp: Date.now(),
  });

  saveHistory(history);
  logActivity('tutor', `Pregunta a ${personality.name}`, question.slice(0, 40));

  return {
    text: prefixed,
    personality,
    category,
  };
}

/**
 * Lee la respuesta del tutor en voz alta.
 */
export function speakTutorResponse(text, options = {}) {
  // Extraer solo el texto después del nombre del personaje
  const cleanText = text.replace(/^[^:]+:\s*/, '');
  speak(cleanText, { rate: 0.85, ...options });
}

/**
 * Obtiene el historial de conversación.
 */
export function getTutorHistory() {
  return getHistory();
}

/**
 * Limpia el historial.
 */
export function clearTutorHistory() {
  localStorage.removeItem(TUTOR_KEY);
}

/**
 * Activa o desactiva el tutor.
 */
export function setTutorEnabled(enabled) {
  localStorage.setItem(TUTOR_ENABLED_KEY, enabled ? '1' : '0');
}

export function isTutorEnabled() {
  return localStorage.getItem(TUTOR_ENABLED_KEY) !== '0';
}

/**
 * Obtiene las personalidades disponibles.
 */
export function getPersonalities() {
  return PERSONALITIES;
}
