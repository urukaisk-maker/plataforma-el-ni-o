// Sistema social - Estructura de datos para comentarios, likes, chat y galería

// Reacciones disponibles
export const REACTIONS = [
  { id: 'love', emoji: '❤️', name: 'Me encanta' },
  { id: 'like', emoji: '👍', name: 'Me gusta' },
  { id: 'celebrate', emoji: '🎉', name: 'Celebrar' },
  { id: 'fire', emoji: '🔥', name: 'Fuego' },
  { id: 'star', emoji: '⭐', name: 'Estrella' },
  { id: 'cool', emoji: '😎', name: 'Genial' },
];

// Datos iniciales de comentarios
export const INITIAL_COMMENTS = [
  {
    id: 'comment_1',
    targetType: 'memory',
    targetId: 'memory_1',
    authorId: 'familia1',
    authorName: 'Papá',
    authorAvatar: '👨',
    content: '¡Qué recuerdo tan especial! Me encanta ver cómo creces cada día.',
    timestamp: new Date('2026-05-20T10:30:00').toISOString(),
    reactions: [
      { userId: 'elnino', reactionId: 'love' },
      { userId: 'familia2', reactionId: 'like' },
    ],
  },
  {
    id: 'comment_2',
    targetType: 'memory',
    targetId: 'memory_2',
    authorId: 'familia2',
    authorName: 'Mamá',
    authorAvatar: '👩',
    content: 'Este momento lo recordaré siempre. Te quiero mucho hijo.',
    timestamp: new Date('2026-05-21T14:15:00').toISOString(),
    reactions: [{ userId: 'elnino', reactionId: 'celebrate' }],
  },
];

// Datos iniciales de likes
export const INITIAL_LIKES = [
  {
    targetType: 'memory',
    targetId: 'memory_1',
    likes: ['familia1', 'familia2', 'familia3'],
  },
  {
    targetType: 'memory',
    targetId: 'memory_2',
    likes: ['elnino', 'familia1'],
  },
  {
    targetType: 'mission',
    targetId: 'mission_1',
    likes: ['familia2', 'familia3'],
  },
];

// Datos iniciales de chat
export const INITIAL_MESSAGES = [
  {
    id: 'msg_1',
    authorId: 'familia1',
    authorName: 'Papá',
    authorAvatar: '👨',
    content: '¡Hola familia! ¿Listos para el gran día?',
    timestamp: new Date('2026-05-25T09:00:00').toISOString(),
    reactions: [],
  },
  {
    id: 'msg_2',
    authorId: 'familia2',
    authorName: 'Mamá',
    authorAvatar: '👩',
    content: '¡Sí! Estoy preparando todo. Va a ser épico 🎉',
    timestamp: new Date('2026-05-25T09:05:00').toISOString(),
    reactions: [{ userId: 'familia1', reactionId: 'celebrate' }],
  },
  {
    id: 'msg_3',
    authorId: 'familia3',
    authorName: 'Hermano',
    authorAvatar: '👦',
    content: 'Yo ya estoy practicando para las misiones gamer 💪',
    timestamp: new Date('2026-05-25T09:10:00').toISOString(),
    reactions: [
      { userId: 'familia2', reactionId: 'fire' },
      { userId: 'familia1', reactionId: 'like' },
    ],
  },
];

// Datos iniciales de galería de fotos
export const INITIAL_PHOTOS = [
  {
    id: 'photo_1',
    uploaderId: 'familia1',
    uploaderName: 'Papá',
    uploaderAvatar: '👨',
    url: '/photos/cumpleanos-2025.jpg',
    thumbnail: '/photos/thumbnails/cumpleanos-2025-thumb.jpg',
    caption: 'Cumpleaños 2025 - Ya creciste mucho',
    timestamp: new Date('2025-06-24T15:30:00').toISOString(),
    likes: ['familia2', 'familia3'],
    comments: ['comment_1'],
    tags: ['cumpleaños', 'familia', 'recuerdos'],
  },
  {
    id: 'photo_2',
    uploaderId: 'familia2',
    uploaderName: 'Mamá',
    uploaderAvatar: '👩',
    url: '/photos/familia-vacaciones.jpg',
    thumbnail: '/photos/thumbnails/familia-vacaciones-thumb.jpg',
    caption: 'Nuestras vacaciones en la playa 🏖️',
    timestamp: new Date('2025-08-15T12:00:00').toISOString(),
    likes: ['familia1', 'elnino'],
    comments: [],
    tags: ['vacaciones', 'playa', 'familia'],
  },
  {
    id: 'photo_3',
    uploaderId: 'familia3',
    uploaderName: 'Hermano',
    uploaderAvatar: '👦',
    url: '/photos/gaming-session.jpg',
    thumbnail: '/photos/thumbnails/gaming-session-thumb.jpg',
    caption: 'Sesión gaming con mi hermano 🎮',
    timestamp: new Date('2026-01-10T20:00:00').toISOString(),
    likes: ['elnino', 'familia1', 'familia2'],
    comments: ['comment_2'],
    tags: ['gaming', 'hermanos', 'diversión'],
  },
];

// Estado inicial del sistema social
export const INITIAL_SOCIAL_STATE = {
  comments: INITIAL_COMMENTS,
  likes: INITIAL_LIKES,
  messages: INITIAL_MESSAGES,
  photos: INITIAL_PHOTOS,
  unreadMessages: 0,
};

// Función para obtener comentarios por tipo y target
export function getCommentsByTarget(targetType, targetId) {
  return INITIAL_COMMENTS.filter(comment => comment.targetType === targetType && comment.targetId === targetId).sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
}

// Función para obtener likes por tipo y target
export function getLikesByTarget(targetType, targetId) {
  const likeData = INITIAL_LIKES.find(like => like.targetType === targetType && like.targetId === targetId);
  return likeData ? likeData.likes : [];
}

// Función para obtener conteo de likes
export function getLikesCount(targetType, targetId) {
  return getLikesByTarget(targetType, targetId).length;
}

// Función para verificar si un usuario dio like
export function hasUserLiked(targetType, targetId, userId) {
  const likes = getLikesByTarget(targetType, targetId);
  return likes.includes(userId);
}

// Función para obtener reacciones de un comentario
export function getCommentReactions(commentId) {
  const comment = INITIAL_COMMENTS.find(c => c.id === commentId);
  return comment ? comment.reactions : [];
}

// Función para obtener conteo de reacciones por tipo
export function getReactionCount(commentId, reactionId) {
  const reactions = getCommentReactions(commentId);
  return reactions.filter(r => r.reactionId === reactionId).length;
}

// Función para obtener mensajes del chat
export function getChatMessages(limit = 50) {
  return INITIAL_MESSAGES.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).slice(-limit);
}

// Función para obtener fotos de la galería
export function getGalleryPhotos(limit = 20) {
  return INITIAL_PHOTOS.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
}

// Función para obtener fotos por etiqueta
export function getPhotosByTag(tag) {
  return INITIAL_PHOTOS.filter(photo => photo.tags.includes(tag)).sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
}

// Función para obtener fotos por usuario
export function getPhotosByUser(userId) {
  return INITIAL_PHOTOS.filter(photo => photo.uploaderId === userId).sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
}

// Función para formatear fecha relativa
export function formatRelativeTime(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora mismo';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}
