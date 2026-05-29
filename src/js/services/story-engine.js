/**
 * Motor de cuentos interactivos.
 * Historias ramificadas donde el niño elige el rumbo.
 * Incluye preguntas de comprensión lectora embebidas.
 */

import { getItem, setItem } from '../utils/storage-adapter.js';
import { addXP } from './gamification-service.js';
import { logActivity } from './activity-service.js';

const STORIES_KEY = 'elnino_stories';
const PROGRESS_KEY = 'elnino_story_progress';

/**
 * Cuentos de ejemplo precargados.
 */
const DEFAULT_STORIES = [
  {
    id: 'story_01',
    title: 'La Misión del Espacio',
    author: 'El Niño Editorial',
    cover: '🚀',
    description: 'Eres un astronauta que debe salvar a tu equipo en una estación espacial abandonada.',
    pages: [
      {
        id: 'p1',
        text: 'Despiertas en la estación espacial Orion. Las luces parpadean y escuchas un ruido extraño en el módulo de ingeniería. Tu compañero, el Capitán Vega, no responde al comunicador.',
        choices: [
          { text: 'Investigar el módulo de ingeniería', nextPage: 'p2', emoji: '🔧' },
          { text: 'Buscar al Capitán Vega primero', nextPage: 'p3', emoji: '👨‍🚀' },
        ],
      },
      {
        id: 'p2',
        text: 'En el módulo de ingeniería descubres que el generador de oxígeno está fallando. Tienes 10 minutos para arreglarlo o la estación quedará sin aire.',
        choices: [
          { text: 'Intentar reparar el generador', nextPage: 'p4', emoji: '⚡' },
          { text: 'Buscar el traje espacial de emergencia', nextPage: 'p5', emoji: '🧑‍🚀' },
        ],
        quiz: {
          question: '¿Cuál es el problema principal en la estación?',
          options: ['No hay luz', 'El generador de oxígeno falla', 'El comunicador no funciona'],
          correct: 1,
        },
      },
      {
        id: 'p3',
        text: 'Encuentras al Capitán Vega en el laboratorio. Está atrapado porque la puerta se bloqueó por falta de energía. Te pide que encuentres la llave manual en el puente de mando.',
        choices: [
          { text: 'Ir al puente de mando', nextPage: 'p6', emoji: '🎛️' },
          { text: 'Intentar forzar la puerta', nextPage: 'p7', emoji: '💪' },
        ],
      },
      {
        id: 'p4',
        text: '¡Lo lograste! Reparas el generador justo a tiempo. El Capitán Vega te felicita por tu rapidez. La estación está a salvo... por ahora.',
        ending: 'good',
        xpReward: 50,
      },
      {
        id: 'p5',
        text: 'Encuentras el traje espacial pero no sabes cómo usarlo. Pierdes tiempo valioso. Por suerte, el Capitán Vega llega y os salváis juntos.',
        ending: 'neutral',
        xpReward: 25,
      },
      {
        id: 'p6',
        text: 'En el puente de mando encuentras la llave y salvas al Capitán. Juntos restauran la energía de la estación. ¡Misión cumplida!',
        ending: 'good',
        xpReward: 50,
      },
      {
        id: 'p7',
        text: 'La puerta no cede y consumes mucho oxígeno. Tienes que pedir ayuda por el comunicador de emergencia. El equipo de rescate llega con retraso.',
        ending: 'bad',
        xpReward: 10,
      },
    ],
  },
];

function ensureStories() {
  const existing = getItem(STORIES_KEY, []);
  if (existing.length === 0) {
    setItem(STORIES_KEY, DEFAULT_STORIES);
    return DEFAULT_STORIES;
  }
  return existing;
}

export function getStories() {
  return ensureStories();
}

export function getStory(id) {
  return getStories().find(s => s.id === id);
}

export function getStoryProgress(storyId) {
  const all = getItem(PROGRESS_KEY, {});
  return all[storyId] || { currentPage: 'p1', completed: false, xpEarned: 0, quizAnswers: [] };
}

function saveStoryProgress(storyId, progress) {
  const all = getItem(PROGRESS_KEY, {});
  all[storyId] = progress;
  setItem(PROGRESS_KEY, all);
}

/**
 * Avanza a la siguiente página según la elección del usuario.
 */
export function makeChoice(storyId, choice) {
  const story = getStory(storyId);
  if (!story) return null;

  const progress = getStoryProgress(storyId);
  const nextPage = story.pages.find(p => p.id === choice.nextPage);
  if (!nextPage) return null;

  progress.currentPage = nextPage.id;

  // Si es un final
  if (nextPage.ending) {
    progress.completed = true;
    progress.ending = nextPage.ending;
    if (nextPage.xpReward && !progress.xpEarned) {
      addXP(nextPage.xpReward);
      progress.xpEarned = nextPage.xpReward;
      logActivity('story', `Cuento completado: ${story.title}`, `Final: ${nextPage.ending}`, nextPage.xpReward);
    }
  }

  saveStoryProgress(storyId, progress);
  return nextPage;
}

/**
 * Valida respuesta de quiz de comprensión lectora.
 */
export function answerQuiz(storyId, pageId, answerIndex) {
  const story = getStory(storyId);
  const page = story?.pages.find(p => p.id === pageId);
  if (!page?.quiz) return { correct: false };

  const correct = page.quiz.correct === answerIndex;
  const progress = getStoryProgress(storyId);
  progress.quizAnswers = progress.quizAnswers || [];
  progress.quizAnswers.push({ pageId, correct });
  saveStoryProgress(storyId, progress);

  if (correct) {
    addXP(10);
    logActivity('story_quiz', 'Respuesta correcta en comprensión lectora', '', 10);
  }

  return { correct, correctIndex: page.quiz.correct };
}

/**
 * Reinicia un cuento.
 */
export function resetStory(storyId) {
  const all = getItem(PROGRESS_KEY, {});
  delete all[storyId];
  setItem(PROGRESS_KEY, all);
}

/**
 * Obtiene estadísticas de lectura del usuario.
 */
export function getReadingStats() {
  const all = getItem(PROGRESS_KEY, {});
  const entries = Object.values(all);
  return {
    storiesStarted: entries.length,
    storiesCompleted: entries.filter(e => e.completed).length,
    totalXpEarned: entries.reduce((a, e) => a + (e.xpEarned || 0), 0),
    quizAccuracy: entries.reduce((a, e) => a + (e.quizAnswers?.filter(q => q.correct).length || 0), 0) /
      Math.max(entries.reduce((a, e) => a + (e.quizAnswers?.length || 0), 0), 1),
  };
}
