// Vista social - Componentes UI para comentarios, likes, chat y galería
import {
  getComments,
  addComment,
  deleteComment,
  addCommentReaction,
  removeCommentReaction,
  getAvailableReactions,
  getCurrentUser,
  toggleLike,
  hasUserLiked,
  getLikesCount,
  getMessages,
  sendMessage,
  addMessageReaction,
  markAsRead,
  getPhotos,
  togglePhotoLike,
  getPhotoComments,
  addPhotoComment,
  uploadPhoto as uploadPhotoService,
} from '../services/social-service.js';

// ==================== COMENTARIOS ====================

// Renderizar sección de comentarios
export function renderCommentsSection(container, targetType, targetId) {
  if (!container) return;

  const comments = getComments(targetType, targetId);
  const reactions = getAvailableReactions();
  const currentUser = getCurrentUser();

  container.innerHTML = `
    <div class="comments-section">
      <div class="comments-section__header">
        <h3 class="comments-section__title">Comentarios (${comments.length})</h3>
      </div>
      
      <div class="comments-section__form">
        <div class="comment-form">
          <div class="comment-form__avatar">${currentUser.avatar}</div>
          <div class="comment-form__input-wrapper">
            <textarea 
              class="comment-form__input" 
              id="commentInput" 
              placeholder="Escribe un comentario..." 
              rows="2"
            ></textarea>
            <div class="comment-form__actions">
              <button class="button button--primary comment-form__submit" id="submitComment">
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="comments-section__list" id="commentsList">
        ${
          comments.length === 0
            ? `
          <div class="comments-section__empty">
            <p>Aún no hay comentarios. ¡Sé el primero en comentar!</p>
          </div>
        `
            : comments.map(comment => renderCommentItem(comment, reactions, currentUser)).join('')
        }
      </div>
    </div>
  `;

  // Event listeners
  const submitBtn = container.querySelector('#submitComment');
  const commentInput = container.querySelector('#commentInput');

  submitBtn?.addEventListener('click', () => {
    const content = commentInput.value.trim();
    if (content) {
      addComment(targetType, targetId, content);
      commentInput.value = '';
      renderCommentsSection(container, targetType, targetId);
    }
  });

  // Event listeners para reacciones y eliminación
  container.querySelectorAll('.comment-item').forEach(item => {
    const commentId = item.dataset.commentId;

    // Reacciones
    item.querySelectorAll('.comment-reaction-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const reactionId = btn.dataset.reactionId;
        const currentReaction = item.dataset.userReaction;

        if (currentReaction === reactionId) {
          removeCommentReaction(commentId);
        } else {
          addCommentReaction(commentId, reactionId);
        }

        renderCommentsSection(container, targetType, targetId);
      });
    });

    // Eliminar comentario
    const deleteBtn = item.querySelector('.comment-item__delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (confirm('¿Eliminar este comentario?')) {
          deleteComment(commentId);
          renderCommentsSection(container, targetType, targetId);
        }
      });
    }
  });
}

// Renderizar item de comentario individual
function renderCommentItem(comment, reactions, currentUser) {
  const isOwn = comment.authorId === currentUser.id;
  const userReaction = comment.userReaction;

  return `
    <div class="comment-item" data-comment-id="${comment.id}" data-user-reaction="${userReaction || ''}">
      <div class="comment-item__avatar">${comment.authorAvatar}</div>
      <div class="comment-item__content">
        <div class="comment-item__header">
          <span class="comment-item__author">${comment.authorName}</span>
          <span class="comment-item__time">${comment.relativeTime}</span>
          ${
            isOwn
              ? `
            <button class="comment-item__delete" title="Eliminar comentario">
              🗑️
            </button>
          `
              : ''
          }
        </div>
        <p class="comment-item__text">${comment.content}</p>
        <div class="comment-item__reactions">
          ${reactions
            .map(reaction => {
              const count = comment.reactions.filter(r => r.reactionId === reaction.id).length;
              const isActive = userReaction === reaction.id;
              return `
              <button 
                class="comment-reaction-btn ${isActive ? 'comment-reaction-btn--active' : ''}" 
                data-reaction-id="${reaction.id}"
                title="${reaction.name}"
              >
                ${reaction.emoji} ${count > 0 ? count : ''}
              </button>
            `;
            })
            .join('')}
        </div>
      </div>
    </div>
  `;
}

// ==================== LIKES ====================

// Renderizar botón de like
export function renderLikeButton(container, targetType, targetId) {
  if (!container) return;

  const isLiked = hasUserLiked(targetType, targetId);
  const likesCount = getLikesCount(targetType, targetId);

  container.innerHTML = `
    <button class="like-button ${isLiked ? 'like-button--liked' : ''}" id="likeBtn">
      <span class="like-button__icon">${isLiked ? '❤️' : '🤍'}</span>
      <span class="like-button__count">${likesCount}</span>
    </button>
  `;

  const likeBtn = container.querySelector('#likeBtn');
  likeBtn?.addEventListener('click', () => {
    toggleLike(targetType, targetId);
    renderLikeButton(container, targetType, targetId);
  });
}

// Renderizar sección de likes
export function renderLikesSection(container, targetType, targetId) {
  if (!container) return;

  const likesCount = getLikesCount(targetType, targetId);
  const isLiked = hasUserLiked(targetType, targetId);

  container.innerHTML = `
    <div class="likes-section">
      <button class="likes-section__button ${isLiked ? 'likes-section__button--liked' : ''}" id="likeSectionBtn">
        <span class="likes-section__icon">${isLiked ? '❤️' : '🤍'}</span>
        <span class="likes-section__count">${likesCount}</span>
        <span class="likes-section__label">${likesCount === 1 ? 'Me gusta' : 'Me gustas'}</span>
      </button>
    </div>
  `;

  const likeBtn = container.querySelector('#likeSectionBtn');
  likeBtn?.addEventListener('click', () => {
    toggleLike(targetType, targetId);
    renderLikesSection(container, targetType, targetId);
  });
}

// ==================== CHAT ====================

// Renderizar chat
export function renderChat(container) {
  if (!container) return;

  const messages = getMessages();
  const currentUser = getCurrentUser();

  container.innerHTML = `
    <div class="chat-container">
      <div class="chat-container__header">
        <h3 class="chat-container__title">Chat Familiar 💬</h3>
        <span class="chat-container__status">En línea</span>
      </div>
      
      <div class="chat-container__messages" id="chatMessages">
        ${
          messages.length === 0
            ? `
          <div class="chat-container__empty">
            <p>¡Inicia la conversación con tu familia!</p>
          </div>
        `
            : messages.map(msg => renderChatMessage(msg, currentUser)).join('')
        }
      </div>
      
      <div class="chat-container__input">
        <div class="chat-input">
          <input 
            type="text" 
            class="chat-input__field" 
            id="chatInput" 
            placeholder="Escribe un mensaje..." 
            autocomplete="off"
          />
          <button class="button button--primary chat-input__send" id="sendChat">
            Enviar
          </button>
        </div>
      </div>
    </div>
  `;

  // Scroll al último mensaje
  const messagesContainer = container.querySelector('#chatMessages');
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Marcar como leídos
  markAsRead();

  // Event listeners
  const sendBtn = container.querySelector('#sendChat');
  const chatInput = container.querySelector('#chatInput');

  const handleSend = () => {
    const content = chatInput.value.trim();
    if (content) {
      sendMessage(content);
      chatInput.value = '';
      renderChat(container);
    }
  };

  sendBtn?.addEventListener('click', handleSend);
  chatInput?.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      handleSend();
    }
  });

  // Reacciones en mensajes
  container.querySelectorAll('.chat-message').forEach(item => {
    const messageId = item.dataset.messageId;
    const reactionsBtn = item.querySelector('.chat-message__reactions-toggle');
    const reactionsMenu = item.querySelector('.chat-message__reactions-menu');

    reactionsBtn?.addEventListener('click', () => {
      reactionsMenu.classList.toggle('chat-message__reactions-menu--visible');
    });

    item.querySelectorAll('.chat-reaction-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const reactionId = btn.dataset.reactionId;
        addMessageReaction(messageId, reactionId);
        renderChat(container);
      });
    });
  });
}

// Renderizar mensaje de chat individual
function renderChatMessage(message, currentUser) {
  const isOwn = message.isOwn;
  const reactions = getAvailableReactions();

  return `
    <div class="chat-message ${isOwn ? 'chat-message--own' : ''}" data-message-id="${message.id}">
      <div class="chat-message__avatar">${message.authorAvatar}</div>
      <div class="chat-message__content">
        <div class="chat-message__header">
          <span class="chat-message__author">${message.authorName}</span>
          <span class="chat-message__time">${message.relativeTime}</span>
        </div>
        <p class="chat-message__text">${message.content}</p>
        ${
          message.reactions.length > 0
            ? `
          <div class="chat-message__reactions-summary">
            ${message.reactions
              .map(r => {
                const reaction = reactions.find(reac => reac.id === r.reactionId);
                return reaction ? reaction.emoji : '';
              })
              .join(' ')}
          </div>
        `
            : ''
        }
        <div class="chat-message__actions">
          <button class="chat-message__reactions-toggle" title="Reaccionar">
            😊
          </button>
          <div class="chat-message__reactions-menu">
            ${reactions
              .map(
                reaction => `
              <button class="chat-reaction-btn" data-reaction-id="${reaction.id}" title="${reaction.name}">
                ${reaction.emoji}
              </button>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==================== GALERÍA DE FOTOS ====================

// Renderizar galería de fotos
export function renderGallery(container) {
  if (!container) return;

  const photos = getPhotos();

  container.innerHTML = `
    <div class="gallery">
      <div class="gallery__header">
        <h3 class="gallery__title">Galería Familiar 📸</h3>
        <span class="gallery__count">${photos.length} fotos</span>
      </div>
      
      <div class="gallery__grid">
        ${
          photos.length === 0
            ? `
          <div class="gallery__empty">
            <p>Aún no hay fotos. ¡Sube la primera!</p>
          </div>
        `
            : photos.map(photo => renderPhotoCard(photo)).join('')
        }
      </div>
    </div>
  `;

  // Event listeners para likes y comentarios
  container.querySelectorAll('.photo-card').forEach(card => {
    const photoId = card.dataset.photoId;

    // Like
    const likeBtn = card.querySelector('.photo-card__like-btn');
    likeBtn?.addEventListener('click', () => {
      togglePhotoLike(photoId);
      renderGallery(container);
    });

    // Comentarios
    const commentToggle = card.querySelector('.photo-card__comments-toggle');
    const commentsSection = card.querySelector('.photo-card__comments');

    commentToggle?.addEventListener('click', () => {
      commentsSection.classList.toggle('photo-card__comments--visible');
      if (commentsSection.classList.contains('photo-card__comments--visible')) {
        renderPhotoComments(commentsSection, photoId);
      }
    });
  });
}

// Renderizar tarjeta de foto
function renderPhotoCard(photo) {
  return `
    <div class="photo-card" data-photo-id="${photo.id}">
      <div class="photo-card__image">
        <img src="${photo.url}" alt="${photo.caption}" loading="lazy" />
      </div>
      <div class="photo-card__content">
        <div class="photo-card__header">
          <div class="photo-card__author">
            <span class="photo-card__avatar">${photo.uploaderAvatar}</span>
            <span class="photo-card__author-name">${photo.uploaderName}</span>
          </div>
          <span class="photo-card__time">${photo.relativeTime}</span>
        </div>
        <p class="photo-card__caption">${photo.caption}</p>
        <div class="photo-card__actions">
          <button class="photo-card__like-btn ${photo.isLiked ? 'photo-card__like-btn--liked' : ''}">
            <span class="photo-card__like-icon">${photo.isLiked ? '❤️' : '🤍'}</span>
            <span class="photo-card__like-count">${photo.likesCount}</span>
          </button>
          <button class="photo-card__comments-toggle">
            <span class="photo-card__comments-icon">💬</span>
            <span class="photo-card__comments-count">${photo.comments.length}</span>
          </button>
        </div>
        <div class="photo-card__comments">
          <!-- Comentarios se cargan al hacer clic -->
        </div>
      </div>
    </div>
  `;
}

// Renderizar comentarios de foto
function renderPhotoComments(container, photoId) {
  const comments = getPhotoComments(photoId);
  const currentUser = getCurrentUser();

  container.innerHTML = `
    <div class="photo-comments">
      <div class="photo-comments__list">
        ${
          comments.length === 0
            ? `
          <p class="photo-comments__empty">Sin comentarios</p>
        `
            : comments
                .map(
                  comment => `
          <div class="photo-comment">
            <span class="photo-comment__avatar">${comment.authorAvatar}</span>
            <div class="photo-comment__content">
              <span class="photo-comment__author">${comment.authorName}</span>
              <p class="photo-comment__text">${comment.content}</p>
              <span class="photo-comment__time">${comment.relativeTime}</span>
            </div>
          </div>
        `
                )
                .join('')
        }
      </div>
      <div class="photo-comments__form">
        <div class="photo-comment-input">
          <span class="photo-comment-input__avatar">${currentUser.avatar}</span>
          <input 
            type="text" 
            class="photo-comment-input__field" 
            placeholder="Añade un comentario..." 
            id="photoCommentInput"
          />
          <button class="photo-comment-input__send" id="sendPhotoComment">➤</button>
        </div>
      </div>
    </div>
  `;

  const sendBtn = container.querySelector('#sendPhotoComment');
  const input = container.querySelector('#photoCommentInput');

  const handleSend = () => {
    const content = input.value.trim();
    if (content) {
      addPhotoComment(photoId, content);
      input.value = '';
      renderPhotoComments(container, photoId);
    }
  };

  sendBtn?.addEventListener('click', handleSend);
  input?.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      handleSend();
    }
  });
}

export function uploadPhoto(url, caption, tags) {
  return uploadPhotoService(url, caption, tags);
}

// ==================== WIDGET DE CHAT FLOTANTE ====================

// Renderizar widget de chat flotante
export function renderFloatingChatWidget(container) {
  if (!container) return;

  const messages = getMessages(3); // Últimos 3 mensajes
  const unreadCount = messages.length;

  container.innerHTML = `
    <div class="floating-chat-widget" id="floatingChatWidget">
      <button class="floating-chat-widget__toggle" id="chatWidgetToggle">
        <span class="floating-chat-widget__icon">💬</span>
        ${
          unreadCount > 0
            ? `
          <span class="floating-chat-widget__badge">${unreadCount}</span>
        `
            : ''
        }
      </button>
      
      <div class="floating-chat-widget__panel" id="chatWidgetPanel">
        <div class="floating-chat-widget__header">
          <h4>Chat Familiar</h4>
          <button class="floating-chat-widget__close" id="chatWidgetClose">×</button>
        </div>
        <div class="floating-chat-widget__messages">
          ${messages
            .slice(-3)
            .map(
              msg => `
            <div class="floating-chat-message">
              <span class="floating-chat-message__avatar">${msg.authorAvatar}</span>
              <div class="floating-chat-message__content">
                <span class="floating-chat-message__author">${msg.authorName}</span>
                <p class="floating-chat-message__text">${msg.content}</p>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
        <button class="button button--primary floating-chat-widget__open-full" id="openFullChat">
          Abrir chat completo
        </button>
      </div>
    </div>
  `;

  const toggle = container.querySelector('#chatWidgetToggle');
  const panel = container.querySelector('#chatWidgetPanel');
  const close = container.querySelector('#chatWidgetClose');
  const openFull = container.querySelector('#openFullChat');

  toggle?.addEventListener('click', () => {
    panel.classList.toggle('floating-chat-widget__panel--visible');
  });

  close?.addEventListener('click', () => {
    panel.classList.remove('floating-chat-widget__panel--visible');
  });

  openFull?.addEventListener('click', () => {
    window.location.href = './chat.html';
  });
}
