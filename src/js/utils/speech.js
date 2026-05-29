/**
 * Utilidad de lectura en voz alta con Web Speech API.
 * Soporte multi-idioma con seleccion de voz nativa por acento.
 * Compatible con Chrome, Edge, Safari. Firefox parcial.
 */

const VOICE_PREFERENCES = {
  es: ['Google español', 'Microsoft Helena', 'Monica', 'Jorge'],
  'es-MX': ['Google español de Estados Unidos', 'Microsoft Sabina'],
  'es-AR': ['Google español de Estados Unidos', 'Microsoft Helena'],
  'es-CO': ['Google español de Estados Unidos', 'Microsoft Helena'],
  en: ['Google US English', 'Microsoft David', 'Samantha', 'Alex'],
  'en-GB': ['Google UK English Female', 'Google UK English Male', 'Microsoft George', 'Microsoft Hazel'],
  pt: ['Google português', 'Microsoft Helia', 'Joana'],
  'pt-BR': ['Google português do Brasil', 'Microsoft Heloisa', 'Microsoft Maria'],
};

function getBestVoice(lang) {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const prefs = VOICE_PREFERENCES[lang] || VOICE_PREFERENCES[lang.split('-')[0]] || [];
  for (const name of prefs) {
    const match = voices.find(v => v.name.includes(name));
    if (match) return match;
  }
  // Fallback a cualquier voz del idioma
  return voices.find(v => v.lang.startsWith(lang.split('-')[0])) || voices[0];
}

/**
 * Verifica si el navegador soporta speechSynthesis.
 * @returns {boolean}
 */
export function isSpeechSupported() {
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

/**
 * Lee un texto en voz alta.
 * @param {string} text
 * @param {object} options
 * @param {number} options.rate - Velocidad (0.1 a 10, default 1)
 * @param {number} options.pitch - Tono (0 a 2, default 1)
 * @param {number} options.volume - Volumen (0 a 1, default 1)
 * @param {string} options.lang - Idioma (default 'es-ES')
 * @returns {boolean} true si se inicio la lectura
 */
export function speak(text, options = {}) {
  if (!isSpeechSupported()) return false;
  if (!text || typeof text !== 'string') return false;

  stopSpeaking();

  const lang = options.lang || 'es-ES';
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = options.rate ?? 0.9;
  utterance.pitch = options.pitch ?? 1;
  utterance.volume = options.volume ?? 1;

  const voice = getBestVoice(lang);
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
  return true;
}

/**
 * Detiene la lectura en curso.
 */
export function stopSpeaking() {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
}

/**
 * Pausa la lectura en curso.
 */
export function pauseSpeaking() {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.pause();
}

/**
 * Reanuda la lectura pausada.
 */
export function resumeSpeaking() {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.resume();
}

/**
 * Verifica si está hablando actualmente.
 * @returns {boolean}
 */
export function isSpeaking() {
  return isSpeechSupported() && window.speechSynthesis.speaking;
}

/**
 * Lista las voces disponibles para un idioma.
 * @param {string} lang
 * @returns {SpeechSynthesisVoice[]}
 */
export function getVoicesForLang(lang) {
  if (!isSpeechSupported()) return [];
  const voices = window.speechSynthesis.getVoices();
  return voices.filter(v => v.lang.startsWith(lang.split('-')[0]));
}
