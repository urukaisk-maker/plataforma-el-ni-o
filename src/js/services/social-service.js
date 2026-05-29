// Servicio social - Gestión de comentarios, likes, chat y galería con localStorage
import { INITIAL_SOCIAL_STATE, REACTIONS, formatRelativeTime } from '../data/social.js';

const SOCIAL_STORAGE_KEY = 'elnino_social';
const CURRENT_USER_KEY = 'elnino_current_user';

// Usuario actual (por defecto El Niño)
const CURRENT_USER = {
  id: 'elnino',
  name: 'El Niño',
  avatar: '🎮',
};

// Obtener datos sociales del localStorage
export function getSocialData() {
  try {
    const data = localStorage.getItem(SOCIAL_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return INITIAL_SOCIAL_STATE;
  } catch (error) {
    console.error('Error al obtener datos sociales:', error);
    return INITIAL_SOCIAL_STATE;
  }
}

// Guardar datos sociales en localStorage
export function saveSocialData(data) {
  try {
    localStorage.setItem(SOCIAL_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error al guardar datos sociales:', error);
  }
}

// ==================== COMENTARIOS ====================

// Añadir comentario
export function addComment(targetType, targetId, content) {
  const data = getSocialData();
  const newComment = {
    id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    targetType,
    targetId,
    authorId: CURRENT_USER.id,
    authorName: CURRENT_USER.name,
    authorAvatar: CURRENT_USER.avatar,
    content,
    timestamp: new Date().toISOString(),
    reactions: [],
  };

  data.comments.push(newComment);
  saveSocialData(data);

  return newComment;
}

// Eliminar comentario
export function deleteComment(commentId) {
  const data = getSocialData();
  const commentIndex = data.comments.findIndex(c => c.id === commentId);

  if (commentIndex >= 0) {
    const comment = data.comments[commentIndex];
    // Solo permitir eliminar si es el autor
    if (comment.authorId === CURRENT_USER.id) {
      data.comments.splice(commentIndex, 1);
      saveSocialData(data);
      return true;
    }
  }

  return false;
}

// Añadir reacción a comentario
export function addCommentReaction(commentId, reactionId) {
  const data = getSocialData();
  const comment = data.comments.find(c => c.id === commentId);

  if (comment) {
    // Verificar si el usuario ya reaccionó
    const existingReactionIndex = comment.reactions.findIndex(r => r.userId === CURRENT_USER.id);

    if (existingReactionIndex >= 0) {
      // Actualizar reacción existente
      comment.reactions[existingReactionIndex].reactionId = reactionId;
    } else {
      // Añadir nueva reacción
      comment.reactions.push({
        userId: CURRENT_USER.id,
        reactionId,
      });
    }

    saveSocialData(data);
    return true;
  }

  return false;
}

// Eliminar reacción de comentario
export function removeCommentReaction(commentId) {
  const data = getSocialData();
  const comment = data.comments.find(c => c.id === commentId);

  if (comment) {
    comment.reactions = comment.reactions.filter(r => r.userId !== CURRENT_USER.id);
    saveSocialData(data);
    return true;
  }

  return false;
}

// Obtener comentarios de un target
export function getComments(targetType, targetId) {
  const data = getSocialData();
  return data.comments
    .filter(c => c.targetType === targetType && c.targetId === targetId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .map(comment => ({
      ...comment,
      relativeTime: formatRelativeTime(comment.timestamp),
      userReaction: comment.reactions.find(r => r.userId === CURRENT_USER.id)?.reactionId || null,
    }));
}

// ==================== LIKES ====================

// Dar like
export function addLike(targetType, targetId) {
  const data = getSocialData();
  let likeData = data.likes.find(l => l.targetType === targetType && l.targetId === targetId);

  if (!likeData) {
    likeData = {
      targetType,
      targetId,
      likes: [],
    };
    data.likes.push(likeData);
  }

  if (!likeData.likes.includes(CURRENT_USER.id)) {
    likeData.likes.push(CURRENT_USER.id);
    saveSocialData(data);
    return true;
  }

  return false;
}

// Quitar like
export function removeLike(targetType, targetId) {
  const data = getSocialData();
  const likeData = data.likes.find(l => l.targetType === targetType && l.targetId === targetId);

  if (likeData) {
    const likeIndex = likeData.likes.indexOf(CURRENT_USER.id);
    if (likeIndex >= 0) {
      likeData.likes.splice(likeIndex, 1);
      saveSocialData(data);
      return true;
    }
  }

  return false;
}

// Toggle like
export function toggleLike(targetType, targetId) {
  const hasLiked = hasUserLiked(targetType, targetId);
  if (hasLiked) {
    return removeLike(targetType, targetId);
  } else {
    return addLike(targetType, targetId);
  }
}

// Verificar si el usuario dio like
export function hasUserLiked(targetType, targetId) {
  const data = getSocialData();
  const likeData = data.likes.find(l => l.targetType === targetType && l.targetId === targetId);
  return likeData ? likeData.likes.includes(CURRENT_USER.id) : false;
}

// Obtener conteo de likes
export function getLikesCount(targetType, targetId) {
  const data = getSocialData();
  const likeData = data.likes.find(l => l.targetType === targetType && l.targetId === targetId);
  return likeData ? likeData.likes.length : 0;
}

// ==================== CHAT ====================

// Enviar mensaje
export function sendMessage(content) {
  const data = getSocialData();
  const newMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    authorId: CURRENT_USER.id,
    authorName: CURRENT_USER.name,
    authorAvatar: CURRENT_USER.avatar,
    content,
    timestamp: new Date().toISOString(),
    reactions: [],
  };

  data.messages.push(newMessage);
  data.unreadMessages = 0; // Resetear unread al enviar mensaje
  saveSocialData(data);

  return newMessage;
}

// Obtener mensajes del chat
export function getMessages(limit = 50) {
  const data = getSocialData();
  return data.messages
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .slice(-limit)
    .map(message => ({
      ...message,
      relativeTime: formatRelativeTime(message.timestamp),
      isOwn: message.authorId === CURRENT_USER.id,
    }));
}

// Añadir reacción a mensaje
export function addMessageReaction(messageId, reactionId) {
  const data = getSocialData();
  const message = data.messages.find(m => m.id === messageId);

  if (message) {
    const existingReactionIndex = message.reactions.findIndex(r => r.userId === CURRENT_USER.id);

    if (existingReactionIndex >= 0) {
      message.reactions[existingReactionIndex].reactionId = reactionId;
    } else {
      message.reactions.push({
        userId: CURRENT_USER.id,
        reactionId,
      });
    }

    saveSocialData(data);
    return true;
  }

  return false;
}

// Obtener mensajes no leídos
export function getUnreadCount() {
  const data = getSocialData();
  return data.unreadMessages;
}

// Marcar mensajes como leídos
export function markAsRead() {
  const data = getSocialData();
  data.unreadMessages = 0;
  saveSocialData(data);
}

// ==================== GALERÍA DE FOTOS ====================

// Subir foto
export function uploadPhoto(url, caption, tags = []) {
  const data = getSocialData();
  const newPhoto = {
    id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    uploaderId: CURRENT_USER.id,
    uploaderName: CURRENT_USER.name,
    uploaderAvatar: CURRENT_USER.avatar,
    url,
    thumbnail: url, // En un sistema real, esto sería una versión miniatura
    caption,
    timestamp: new Date().toISOString(),
    likes: [],
    comments: [],
    tags,
  };

  data.photos.unshift(newPhoto);
  saveSocialData(data);

  return newPhoto;
}

// Obtener fotos de la galería
export function getPhotos(limit = 20) {
  const data = getSocialData();
  return data.photos
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit)
    .map(photo => ({
      ...photo,
      relativeTime: formatRelativeTime(photo.timestamp),
      isOwn: photo.uploaderId === CURRENT_USER.id,
      isLiked: photo.likes.includes(CURRENT_USER.id),
      likesCount: photo.likes.length,
    }));
}

// Obtener fotos por etiqueta
export function getPhotosByTag(tag) {
  const data = getSocialData();
  return data.photos
    .filter(photo => photo.tags.includes(tag))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .map(photo => ({
      ...photo,
      relativeTime: formatRelativeTime(photo.timestamp),
      isOwn: photo.uploaderId === CURRENT_USER.id,
      isLiked: photo.likes.includes(CURRENT_USER.id),
      likesCount: photo.likes.length,
    }));
}

// Dar like a foto
export function likePhoto(photoId) {
  const data = getSocialData();
  const photo = data.photos.find(p => p.id === photoId);

  if (photo) {
    if (!photo.likes.includes(CURRENT_USER.id)) {
      photo.likes.push(CURRENT_USER.id);
      saveSocialData(data);
      return true;
    }
  }

  return false;
}

// Quitar like de foto
export function unlikePhoto(photoId) {
  const data = getSocialData();
  const photo = data.photos.find(p => p.id === photoId);

  if (photo) {
    const likeIndex = photo.likes.indexOf(CURRENT_USER.id);
    if (likeIndex >= 0) {
      photo.likes.splice(likeIndex, 1);
      saveSocialData(data);
      return true;
    }
  }

  return false;
}

// Toggle like en foto
export function togglePhotoLike(photoId) {
  const data = getSocialData();
  const photo = data.photos.find(p => p.id === photoId);

  if (photo) {
    if (photo.likes.includes(CURRENT_USER.id)) {
      photo.likes = photo.likes.filter(id => id !== CURRENT_USER.id);
    } else {
      photo.likes.push(CURRENT_USER.id);
    }
    saveSocialData(data);
    return true;
  }

  return false;
}

// Añadir comentario a foto
export function addPhotoComment(photoId, content) {
  const data = getSocialData();
  const photo = data.photos.find(p => p.id === photoId);

  if (photo) {
    const newComment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      targetType: 'photo',
      targetId: photoId,
      authorId: CURRENT_USER.id,
      authorName: CURRENT_USER.name,
      authorAvatar: CURRENT_USER.avatar,
      content,
      timestamp: new Date().toISOString(),
      reactions: [],
    };

    data.comments.push(newComment);
    photo.comments.push(newComment.id);
    saveSocialData(data);

    return newComment;
  }

  return null;
}

// Obtener comentarios de una foto
export function getPhotoComments(photoId) {
  const data = getSocialData();
  const photo = data.photos.find(p => p.id === photoId);

  if (photo) {
    return data.comments
      .filter(c => c.targetType === 'photo' && c.targetId === photoId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(comment => ({
        ...comment,
        relativeTime: formatRelativeTime(comment.timestamp),
        userReaction: comment.reactions.find(r => r.userId === CURRENT_USER.id)?.reactionId || null,
      }));
  }

  return [];
}

// ==================== UTILIDADES ====================

// Obtener todas las reacciones disponibles
export function getAvailableReactions() {
  return REACTIONS;
}

// Obtener usuario actual
export function getCurrentUser() {
  return CURRENT_USER;
}

// Resetear datos sociales (para testing)
export function resetSocialData() {
  localStorage.removeItem(SOCIAL_STORAGE_KEY);
}
