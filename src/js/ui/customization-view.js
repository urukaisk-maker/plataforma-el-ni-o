// Vista de personalización - Componentes UI para avatar, temas, misiones personalizadas y tarjetas
import {
  AVATAR_OPTIONS,
  THEMES,
  CARD_TEMPLATES
} from "../data/customization.js";
import {
  getAvatar,
  updateAvatarName,
  updateAvatarTitle,
  updateAvatarFace,
  updateAvatarAccessory,
  updateAvatarBackground,
  applyTheme,
  getCurrentTheme,
  createCustomMission,
  getCustomMissions,
  deleteCustomMission,
  completeCustomMission,
  createCustomCard,
  getCustomCards,
  deleteCustomCard
} from "../services/customization-service.js";

// ==================== EDITOR DE AVATAR ====================

// Renderizar editor de avatar
export function renderAvatarEditor(container) {
  if (!container) return;

  const currentAvatar = getAvatar();

  container.innerHTML = `
    <div class="avatar-editor">
      <div class="avatar-editor__preview">
        <div class="avatar-preview" style="background: ${currentAvatar.backgroundGradient}">
          <span class="avatar-preview__face">${currentAvatar.faceEmoji}</span>
          ${currentAvatar.accessoryEmoji ? `<span class="avatar-preview__accessory">${currentAvatar.accessoryEmoji}</span>` : ''}
        </div>
        <div class="avatar-preview__info">
          <input 
            type="text" 
            class="avatar-preview__name-input" 
            id="avatarName" 
            value="${currentAvatar.name}" 
            placeholder="Nombre"
          />
          <input 
            type="text" 
            class="avatar-preview__title-input" 
            id="avatarTitle" 
            value="${currentAvatar.title}" 
            placeholder="Título"
          />
        </div>
      </div>

      <div class="avatar-editor__options">
        <div class="avatar-option-section">
          <h3 class="avatar-option-section__title">Cara</h3>
          <div class="avatar-option-grid">
            ${AVATAR_OPTIONS.faces.map(face => `
              <button 
                class="avatar-option-btn ${currentAvatar.face === face.id ? 'avatar-option-btn--selected' : ''}" 
                data-type="face" 
                data-id="${face.id}"
                title="${face.name}"
              >
                ${face.emoji}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="avatar-option-section">
          <h3 class="avatar-option-section__title">Accesorio</h3>
          <div class="avatar-option-grid">
            ${AVATAR_OPTIONS.accessories.map(acc => `
              <button 
                class="avatar-option-btn ${currentAvatar.accessory === acc.id ? 'avatar-option-btn--selected' : ''}" 
                data-type="accessory" 
                data-id="${acc.id}"
                title="${acc.name}"
              >
                ${acc.emoji}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="avatar-option-section">
          <h3 class="avatar-option-section__title">Fondo</h3>
          <div class="avatar-option-grid">
            ${AVATAR_OPTIONS.backgrounds.map(bg => `
              <button 
                class="avatar-option-btn avatar-option-btn--color ${currentAvatar.background === bg.id ? 'avatar-option-btn--selected' : ''}" 
                data-type="background" 
                data-id="${bg.id}"
                style="background: ${bg.gradient}"
                title="${bg.name}"
              >
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Event listeners para opciones de avatar
  container.querySelectorAll('.avatar-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      const id = btn.dataset.id;

      switch (type) {
        case 'face':
          updateAvatarFace(id);
          break;
        case 'accessory':
          updateAvatarAccessory(id);
          break;
        case 'background':
          updateAvatarBackground(id);
          break;
      }

      renderAvatarEditor(container);
    });
  });

  // Event listeners para nombre y título
  const nameInput = container.querySelector('#avatarName');
  const titleInput = container.querySelector('#avatarTitle');

  nameInput?.addEventListener('change', (e) => {
    updateAvatarName(e.target.value);
  });

  titleInput?.addEventListener('change', (e) => {
    updateAvatarTitle(e.target.value);
  });
}

// ==================== SELECTOR DE TEMAS ====================

// Renderizar selector de temas
export function renderThemeSelector(container) {
  if (!container) return;

  const currentTheme = getCurrentTheme();

  container.innerHTML = `
    <div class="theme-selector">
      <h3 class="theme-selector__title">Selecciona un tema</h3>
      <div class="theme-grid">
        ${THEMES.map(theme => `
          <button 
            class="theme-card ${currentTheme === theme.id ? 'theme-card--selected' : ''}" 
            data-theme-id="${theme.id}"
          >
            <div class="theme-card__preview" style="background: ${theme.colors.background}">
              <div class="theme-card__color-dot" style="background: ${theme.colors.primary}"></div>
              <div class="theme-card__color-dot" style="background: ${theme.colors.secondary}"></div>
              <div class="theme-card__color-dot" style="background: ${theme.colors.accent}"></div>
            </div>
            <div class="theme-card__info">
              <h4 class="theme-card__name">${theme.name}</h4>
              <p class="theme-card__description">${theme.description}</p>
            </div>
            ${currentTheme === theme.id ? '<span class="theme-card__check">✓</span>' : ''}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  // Event listeners para selección de tema
  container.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
      const themeId = card.dataset.themeId;
      applyTheme(themeId);
      renderThemeSelector(container);
    });
  });
}

// ==================== CREADOR DE MISIONES ====================

// Renderizar creador de misiones
export function renderMissionCreator(container) {
  if (!container) return;

  const customMissions = getCustomMissions();

  container.innerHTML = `
    <div class="mission-creator">
      <div class="mission-creator__form">
        <h3 class="mission-creator__title">Crear misión personalizada</h3>
        
        <div class="mission-form">
          <div class="mission-form__field">
            <label for="missionTitle">Título</label>
            <input type="text" id="missionTitle" class="mission-form__input" placeholder="Título de la misión" />
          </div>

          <div class="mission-form__field">
            <label for="missionDescription">Descripción</label>
            <textarea id="missionDescription" class="mission-form__textarea" rows="3" placeholder="Describe la misión..."></textarea>
          </div>

          <div class="mission-form__field">
            <label for="missionDifficulty">Dificultad</label>
            <select id="missionDifficulty" class="mission-form__select">
              <option value="easy">Fácil</option>
              <option value="medium">Media</option>
              <option value="hard">Difícil</option>
              <option value="legendary">Legendaria</option>
            </select>
          </div>

          <div class="mission-form__field">
            <label for="missionXP">Recompensa XP</label>
            <input type="number" id="missionXP" class="mission-form__input" placeholder="100" min="0" />
          </div>

          <div class="mission-form__field">
            <label for="missionRewards">Recompensas (separadas por comas)</label>
            <input type="text" id="missionRewards" class="mission-form__input" placeholder="Insignia, Título, etc." />
          </div>

          <button class="button button--primary mission-form__submit" id="createMissionBtn">
            Crear misión
          </button>
        </div>
      </div>

      <div class="mission-creator__list">
        <h3 class="mission-creator__title">Misiones personalizadas</h3>
        ${customMissions.length === 0 ? `
          <p class="mission-creator__empty">No hay misiones personalizadas aún.</p>
        ` : `
          <div class="custom-missions-list">
            ${customMissions.map(mission => renderCustomMissionItem(mission)).join('')}
          </div>
        `}
      </div>
    </div>
  `;

  // Event listener para crear misión
  const createBtn = container.querySelector('#createMissionBtn');
  createBtn?.addEventListener('click', () => {
    const title = container.querySelector('#missionTitle').value.trim();
    const description = container.querySelector('#missionDescription').value.trim();
    const difficulty = container.querySelector('#missionDifficulty').value;
    const xpReward = parseInt(container.querySelector('#missionXP').value) || 0;
    const rewards = container.querySelector('#missionRewards').value.split(',').map(r => r.trim()).filter(r => r);

    const result = createCustomMission({
      title,
      description,
      difficulty,
      xpReward,
      rewards
    });

    if (result.success) {
      // Limpiar formulario
      container.querySelector('#missionTitle').value = '';
      container.querySelector('#missionDescription').value = '';
      container.querySelector('#missionXP').value = '';
      container.querySelector('#missionRewards').value = '';
      // Recargar lista
      renderMissionCreator(container);
    } else {
      alert('Error: ' + result.errors.join(', '));
    }
  });

  // Event listeners para acciones de misiones
  container.querySelectorAll('.custom-mission-item').forEach(item => {
    const missionId = item.dataset.missionId;

    // Completar misión
    const completeBtn = item.querySelector('.custom-mission-item__complete');
    completeBtn?.addEventListener('click', () => {
      completeCustomMission(missionId);
      renderMissionCreator(container);
    });

    // Eliminar misión
    const deleteBtn = item.querySelector('.custom-mission-item__delete');
    deleteBtn?.addEventListener('click', () => {
      if (confirm('¿Eliminar esta misión?')) {
        deleteCustomMission(missionId);
        renderMissionCreator(container);
      }
    });
  });
}

// Renderizar item de misión personalizada
function renderCustomMissionItem(mission) {
  const difficultyColors = {
    easy: '#7cff6b',
    medium: '#ffd700',
    hard: '#ff6b2b',
    legendary: '#ff2bd4'
  };

  return `
    <div class="custom-mission-item" data-mission-id="${mission.id}">
      <div class="custom-mission-item__header">
        <span class="custom-mission-item__difficulty" style="background: ${difficultyColors[mission.difficulty]}">
          ${mission.difficulty.toUpperCase()}
        </span>
        <span class="custom-mission-item__xp">+${mission.xpReward} XP</span>
        ${mission.completed ? '<span class="custom-mission-item__status">✓ Completada</span>' : ''}
      </div>
      <h4 class="custom-mission-item__title">${mission.title}</h4>
      <p class="custom-mission-item__description">${mission.description}</p>
      ${mission.rewards.length > 0 ? `
        <div class="custom-mission-item__rewards">
          <strong>Recompensas:</strong> ${mission.rewards.join(', ')}
        </div>
      ` : ''}
      <div class="custom-mission-item__actions">
        ${!mission.completed ? `
          <button class="button button--primary custom-mission-item__complete">
            Completar
          </button>
        ` : ''}
        <button class="button button--ghost custom-mission-item__delete">
          Eliminar
        </button>
      </div>
    </div>
  `;
}

// ==================== DISEÑADOR DE TARJETAS ====================

// Renderizar diseñador de tarjetas
export function renderCardDesigner(container) {
  if (!container) return;

  const customCards = getCustomCards();

  container.innerHTML = `
    <div class="card-designer">
      <div class="card-designer__form">
        <h3 class="card-designer__title">Crear tarjeta digital</h3>
        
        <div class="card-form">
          <div class="card-form__field">
            <label for="cardTitle">Título</label>
            <input type="text" id="cardTitle" class="card-form__input" placeholder="Título de la tarjeta" />
          </div>

          <div class="card-form__field">
            <label for="cardMessage">Mensaje</label>
            <textarea id="cardMessage" class="card-form__textarea" rows="3" placeholder="Escribe tu mensaje..."></textarea>
          </div>

          <div class="card-form__field">
            <label for="cardTemplate">Plantilla</label>
            <select id="cardTemplate" class="card-form__select">
              ${CARD_TEMPLATES.map(template => `
                <option value="${template.id}">${template.name} - ${template.description}</option>
              `).join('')}
            </select>
          </div>

          <div class="card-form__field">
            <label for="cardRecipient">Destinatario</label>
            <input type="text" id="cardRecipient" class="card-form__input" placeholder="Nombre del destinatario" />
          </div>

          <button class="button button--primary card-form__submit" id="createCardBtn">
            Crear tarjeta
          </button>
        </div>
      </div>

      <div class="card-designer__list">
        <h3 class="card-designer__title">Tarjetas creadas</h3>
        ${customCards.length === 0 ? `
          <p class="card-designer__empty">No hay tarjetas creadas aún.</p>
        ` : `
          <div class="custom-cards-list">
            ${customCards.map(card => renderCustomCardItem(card)).join('')}
          </div>
        `}
      </div>
    </div>
  `;

  // Event listener para crear tarjeta
  const createBtn = container.querySelector('#createCardBtn');
  createBtn?.addEventListener('click', () => {
    const title = container.querySelector('#cardTitle').value.trim();
    const message = container.querySelector('#cardMessage').value.trim();
    const templateId = container.querySelector('#cardTemplate').value;
    const recipient = container.querySelector('#cardRecipient').value.trim();

    const result = createCustomCard({
      title,
      message,
      templateId,
      recipient
    });

    if (result.success) {
      // Limpiar formulario
      container.querySelector('#cardTitle').value = '';
      container.querySelector('#cardMessage').value = '';
      container.querySelector('#cardRecipient').value = '';
      // Recargar lista
      renderCardDesigner(container);
    } else {
      alert('Error: ' + result.errors.join(', '));
    }
  });

  // Event listeners para acciones de tarjetas
  container.querySelectorAll('.custom-card-item').forEach(item => {
    const cardId = item.dataset.cardId;

    // Eliminar tarjeta
    const deleteBtn = item.querySelector('.custom-card-item__delete');
    deleteBtn?.addEventListener('click', () => {
      if (confirm('¿Eliminar esta tarjeta?')) {
        deleteCustomCard(cardId);
        renderCardDesigner(container);
      }
    });
  });
}

// Renderizar item de tarjeta personalizada
function renderCustomCardItem(card) {
  const template = CARD_TEMPLATES.find(t => t.id === card.templateId);
  const style = template?.style || {};

  return `
    <div class="custom-card-item" data-card-id="${card.id}">
      <div class="custom-card-item__preview" style="
        background: ${style.background};
        border: ${style.border};
        border-radius: ${style.borderRadius};
        font-family: ${style.fontFamily};
      ">
        <h4 class="custom-card-item__preview-title" style="color: ${style.primaryColor}">${card.title}</h4>
        <p class="custom-card-item__preview-message">${card.message}</p>
        ${card.recipient ? `<p class="custom-card-item__preview-recipient">Para: ${card.recipient}</p>` : ''}
      </div>
      <div class="custom-card-item__actions">
        <button class="button button--ghost custom-card-item__delete">
          Eliminar
        </button>
      </div>
    </div>
  `;
}

// ==================== PREVIEW DE TARJETA ====================

// Renderizar preview de tarjeta individual
export function renderCardPreview(container, cardData) {
  if (!container) return;

  const template = CARD_TEMPLATES.find(t => t.id === cardData.templateId);
  const style = template?.style || {};

  container.innerHTML = `
    <div class="card-preview" style="
      background: ${style.background};
      border: ${style.border};
      border-radius: ${style.borderRadius};
      font-family: ${style.fontFamily};
      padding: 32px;
      max-width: 400px;
      margin: 0 auto;
    ">
      <h2 class="card-preview__title" style="color: ${style.primaryColor}; margin: 0 0 16px 0;">${cardData.title}</h2>
      <p class="card-preview__message" style="margin: 0 0 16px 0; line-height: 1.6;">${cardData.message}</p>
      ${cardData.recipient ? `
        <p class="card-preview__recipient" style="margin: 0; opacity: 0.8;">Para: ${cardData.recipient}</p>
      ` : ''}
      <p class="card-preview__date" style="margin: 16px 0 0 0; opacity: 0.6; font-size: 0.85rem;">
        ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
    </div>
  `;
}
