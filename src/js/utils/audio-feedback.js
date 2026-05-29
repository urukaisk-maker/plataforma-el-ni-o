/**
 * Feedback auditivo con Web Audio API.
 * No requiere archivos externos — genera sonidos sintéticos.
 */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

/**
 * Reproduce un tono simple.
 * @param {number} frequency - Frecuencia en Hz
 * @param {number} duration - Duración en segundos
 * @param {string} type - Tipo de onda: 'sine', 'square', 'sawtooth', 'triangle'
 * @param {number} volume - Volumen 0-1
 */
export function playTone(frequency, duration, type = 'sine', volume = 0.3) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Silencioso si Web Audio no está disponible
  }
}

/**
 * Sonido de acierto (tono ascendente alegre).
 */
export function playSuccessSound() {
  playTone(523, 0.15, 'sine', 0.25); // Do
  setTimeout(() => playTone(659, 0.15, 'sine', 0.25), 100); // Mi
  setTimeout(() => playTone(784, 0.3, 'sine', 0.3), 200); // Sol
}

/**
 * Sonido de logro / insignia (fanfarria corta).
 */
export function playAchievementSound() {
  playTone(440, 0.1, 'square', 0.15);
  setTimeout(() => playTone(554, 0.1, 'square', 0.15), 100);
  setTimeout(() => playTone(659, 0.1, 'square', 0.15), 200);
  setTimeout(() => playTone(880, 0.4, 'square', 0.2), 300);
}

/**
 * Sonido de click / interacción (tono corto y suave).
 */
export function playClickSound() {
  playTone(800, 0.05, 'sine', 0.1);
}

/**
 * Sonido de error (tono descendente).
 */
export function playErrorSound() {
  playTone(300, 0.2, 'sawtooth', 0.15);
  setTimeout(() => playTone(200, 0.3, 'sawtooth', 0.15), 150);
}

/**
 * Sonido de subida de nivel (escala ascendente).
 */
export function playLevelUpSound() {
  const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, 'sine', 0.2), i * 80);
  });
}

/**
 * Habilita el audio en respuesta a una interacción del usuario.
 * Necesario en Safari donde AudioContext requiere gesto.
 */
export function enableAudio() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}
