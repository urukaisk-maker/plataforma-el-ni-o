/**
 * Editor de lecciones avanzado — Sistema de bloques.
 * Crea lecciones con texto, video, quiz, audio y arrastrar-soltar.
 * Todo en localStorage (stub para futuro backend).
 */

import { getItem, setItem } from '../utils/storage-adapter.js';
import { generateShortId } from '../utils/id.js';

const LESSONS_KEY = 'elnino_lessons';

export const BLOCK_TYPES = {
  text: { label: 'Texto', icon: '📝' },
  video: { label: 'Video', icon: '🎬' },
  quiz: { label: 'Quiz', icon: '🧩' },
  audio: { label: 'Audio', icon: '🔊' },
  image: { label: 'Imagen', icon: '🖼️' },
  divider: { label: 'Separador', icon: '➖' },
};

/**
 * Obtiene todas las lecciones guardadas.
 */
export function getLessons() {
  return getItem(LESSONS_KEY, []);
}

/**
 * Guarda una lección (crear o actualizar).
 */
export function saveLesson(lesson) {
  const lessons = getLessons();
  const idx = lessons.findIndex(l => l.id === lesson.id);
  if (idx >= 0) {
    lessons[idx] = { ...lessons[idx], ...lesson, updatedAt: new Date().toISOString() };
  } else {
    lesson.id = lesson.id || `les_${generateShortId()}`;
    lesson.createdAt = new Date().toISOString();
    lessons.push(lesson);
  }
  setItem(LESSONS_KEY, lessons);
  return lesson;
}

/**
 * Elimina una lección.
 */
export function deleteLesson(id) {
  const lessons = getLessons().filter(l => l.id !== id);
  setItem(LESSONS_KEY, lessons);
}

/**
 * Crea una lección vacía con plantilla inicial.
 */
export function createEmptyLesson(title = 'Nueva lección') {
  return {
    id: `les_${generateShortId()}`,
    title,
    description: '',
    author: 'Anónimo',
    blocks: [
      { id: generateShortId(), type: 'text', content: 'Escribe aquí el contenido de tu lección...' },
    ],
    tags: [],
    difficulty: 'easy',
    subject: 'general',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: false,
    ratings: [],
    downloads: 0,
  };
}

/**
 * Clona una lección existente.
 */
export function cloneLesson(lesson) {
  return {
    ...lesson,
    id: `les_${generateShortId()}`,
    title: `${lesson.title} (copia)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ratings: [],
    downloads: 0,
  };
}

/**
 * Añade un bloque a una lección.
 */
export function addBlock(lesson, type, content = '') {
  const defaults = {
    text: 'Nuevo texto...',
    video: 'https://www.youtube.com/embed/',
    quiz: { question: 'Pregunta', options: ['Opción A', 'Opción B', 'Opción C'], correct: 0 },
    audio: 'https://example.com/audio.mp3',
    image: 'https://example.com/image.jpg',
    divider: '',
  };
  lesson.blocks.push({
    id: generateShortId(),
    type,
    content: type === 'quiz' ? defaults.quiz : (content || defaults[type] || ''),
  });
  return lesson;
}

/**
 * Mueve un bloque hacia arriba o abajo.
 */
export function moveBlock(lesson, blockId, direction) {
  const idx = lesson.blocks.findIndex(b => b.id === blockId);
  if (idx < 0) return lesson;
  const newIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (newIdx < 0 || newIdx >= lesson.blocks.length) return lesson;
  [lesson.blocks[idx], lesson.blocks[newIdx]] = [lesson.blocks[newIdx], lesson.blocks[idx]];
  return lesson;
}

/**
 * Elimina un bloque.
 */
export function removeBlock(lesson, blockId) {
  lesson.blocks = lesson.blocks.filter(b => b.id !== blockId);
  return lesson;
}

/**
 * Calcula rating promedio de una lección.
 */
export function getLessonRating(lesson) {
  if (!lesson.ratings || lesson.ratings.length === 0) return 0;
  return lesson.ratings.reduce((a, b) => a + b, 0) / lesson.ratings.length;
}
