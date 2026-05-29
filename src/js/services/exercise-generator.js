/**
 * Generador automático de ejercicios educativos.
 * Stub local con templates — en producción conecta a OpenAI API.
 */

import { logActivity } from './activity-service.js';

const TOPICS = {
  sumas: {
    name: 'Sumas',
    generate: () => {
      const a = Math.floor(Math.random() * 50) + 1;
      const b = Math.floor(Math.random() * 50) + 1;
      const correct = a + b;
      const distractors = [
        correct + Math.floor(Math.random() * 5) + 1,
        correct - Math.floor(Math.random() * 5) - 1,
        correct + 10,
      ];
      return {
        question: `¿Cuánto es ${a} + ${b}?`,
        correct,
        options: shuffle([correct, ...distractors]),
        hint: `Suma las unidades: ${a % 10} + ${b % 10}. Luego las decenas.`,
      };
    },
  },
  restas: {
    name: 'Restas',
    generate: () => {
      const a = Math.floor(Math.random() * 50) + 10;
      const b = Math.floor(Math.random() * a);
      const correct = a - b;
      const distractors = [
        correct + 1,
        correct - 1,
        a + b,
      ];
      return {
        question: `¿Cuánto es ${a} - ${b}?`,
        correct,
        options: shuffle([correct, ...distractors]),
        hint: `Piensa: ¿qué número sumado a ${b} da ${a}?`,
      };
    },
  },
  multiplicacion: {
    name: 'Multiplicación',
    generate: () => {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      const correct = a * b;
      const distractors = [
        correct + a,
        correct - b,
        a + b,
      ];
      return {
        question: `¿Cuánto es ${a} × ${b}?`,
        correct,
        options: shuffle([correct, ...distractors]),
        hint: `Recuerda: ${a} × ${b} es sumar ${a} veces el número ${b}.`,
      };
    },
  },
  historia: {
    name: 'Historia',
    generate: () => {
      const questions = [
        {
          question: '¿En qué año Cristóbal Colón llegó a América?',
          correct: 1492,
          options: [1492, 1498, 1502, 1488],
          hint: 'Fue un año bisiesto del siglo XV.',
        },
        {
          question: '¿Quién pintó la Mona Lisa?',
          correct: 'Leonardo da Vinci',
          options: ['Leonardo da Vinci', 'Miguel Ángel', 'Rafael', 'Donatello'],
          hint: 'Era un inventor, científico y artista italiano.',
        },
      ];
      return questions[Math.floor(Math.random() * questions.length)];
    },
  },
  ciencia: {
    name: 'Ciencia',
    generate: () => {
      const questions = [
        {
          question: '¿Cuál es el planeta más grande del sistema solar?',
          correct: 'Júpiter',
          options: ['Júpiter', 'Saturno', 'Neptuno', 'Marte'],
          hint: 'Es una gigante de gas con una Gran Mancha Roja.',
        },
        {
          question: '¿Cuántos huesos tiene el cuerpo humano adulto?',
          correct: 206,
          options: [206, 196, 216, 186],
          hint: 'Empieza por 2 y termina por 6.',
        },
      ];
      return questions[Math.floor(Math.random() * questions.length)];
    },
  },
};

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Genera un ejercicio del tema indicado.
 * @param {string} topicId
 * @returns {object|null}
 */
export function generateExercise(topicId) {
  const topic = TOPICS[topicId];
  if (!topic) return null;

  const exercise = topic.generate();
  exercise.topic = topic.name;
  exercise.topicId = topicId;
  exercise.id = `ex_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  logActivity('exercise', 'Ejercicio generado', topic.name);
  return exercise;
}

/**
 * Devuelve los temas disponibles.
 */
export function getAvailableTopics() {
  return Object.entries(TOPICS).map(([id, t]) => ({ id, name: t.name }));
}

/**
 * Valida la respuesta del usuario.
 * @param {object} exercise
 * @param {any} answer
 * @returns {boolean}
 */
export function validateAnswer(exercise, answer) {
  return exercise.correct === Number(answer);
}

/**
 * Obtiene estadísticas de ejercicios completados.
 */
export function getExerciseStats() {
  try {
    const raw = localStorage.getItem('elnino_exercise_stats');
    return raw ? JSON.parse(raw) : { completed: 0, correct: 0, streak: 0, byTopic: {} };
  } catch {
    return { completed: 0, correct: 0, streak: 0, byTopic: {} };
  }
}

export function saveExerciseStats(stats) {
  try {
    localStorage.setItem('elnino_exercise_stats', JSON.stringify(stats));
  } catch {
    // Silencioso
  }
}
