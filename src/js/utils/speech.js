/**
 * Utilidad de lectura en voz alta con Web Speech API.
 * Compatible con Chrome, Edge, Safari. Firefox parcial.
 */

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
 * @returns {boolean} true si se inició la lectura
 */
export function speak(text, options = {}) {
  if (!isSpeechSupported()) return false;
  if (!text || typeof text !== 'string') return false;

  // Cancelar lectura previa
  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = options.rate ?? 0.9;
  utterance.pitch = options.pitch ?? 1;
  utterance.volume = options.volume ?? 1;

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
