// Vista de gamificación - Componentes UI para mostrar niveles, XP y progreso
import { getPlayerStats, getLeaderboard } from "../services/gamification-service.js";
import { LEVELS, BADGES } from "../data/gamification.js";

// Renderizar barra de XP del jugador
export function renderXPBar(container) {
  if (!container) return;

  const stats = getPlayerStats();
  const { player, levelInfo, xpToNext } = stats;
  
  // Calcular porcentaje de progreso al siguiente nivel
  const currentLevelXP = levelInfo.xpRequired;
  const nextLevelIndex = LEVELS.findIndex(l => l.level === levelInfo.level) + 1;
  const nextLevelXP = nextLevelIndex < LEVELS.length ? LEVELS[nextLevelIndex].xpRequired : currentLevelXP + 1000;
  const progressPercent = xpToNext > 0 ? ((player.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100 : 100;

  container.innerHTML = `
    <div class="xp-bar-container">
      <div class="xp-bar-info">
        <span class="xp-bar-level">Nivel ${levelInfo.level} - ${levelInfo.name}</span>
        <span class="xp-bar-xp">${player.xp} XP</span>
      </div>
      <div class="xp-bar-track">
        <div class="xp-bar-fill" style="width: ${progressPercent}%"></div>
      </div>
      <div class="xp-bar-label">
        ${xpToNext > 0 ? `${xpToNext} XP para nivel ${levelInfo.level + 1}` : '¡Nivel máximo!'}
      </div>
    </div>
  `;
}

// Renderizar tarjeta de perfil del jugador
export function renderPlayerProfile(container) {
  if (!container) return;

  const stats = getPlayerStats();
  const { player, levelInfo, badgeProgress, dailyStreak, perfectDays } = stats;

  container.innerHTML = `
    <div class="player-profile">
      <div class="player-profile__header">
        <div class="player-profile__avatar" style="border-color: ${levelInfo.color}">
          <span class="player-profile__emoji">${player.avatar}</span>
        </div>
        <div class="player-profile__info">
          <h2 class="player-profile__name">${player.name}</h2>
          <div class="player-profile__level" style="color: ${levelInfo.color}">
            Nivel ${levelInfo.level} - ${levelInfo.name}
          </div>
          <div class="player-profile__xp">${player.xp} XP</div>
        </div>
      </div>
      
      <div class="player-profile__stats">
        <div class="stat-item">
          <span class="stat-item__icon">🎯</span>
          <span class="stat-item__value">${player.completedMissions}</span>
          <span class="stat-item__label">Misiones</span>
        </div>
        <div class="stat-item">
          <span class="stat-item__icon">📸</span>
          <span class="stat-item__value">${player.unlockedMemories}</span>
          <span class="stat-item__label">Recuerdos</span>
        </div>
        <div class="stat-item">
          <span class="stat-item__icon">🎬</span>
          <span class="stat-item__value">${player.videosWatched}</span>
          <span class="stat-item__label">Videos</span>
        </div>
        <div class="stat-item">
          <span class="stat-item__icon">🏅</span>
          <span class="stat-item__value">${player.badges.length}</span>
          <span class="stat-item__label">Insignias</span>
        </div>
      </div>

      <div class="player-profile__streaks">
        <div class="streak-item">
          <span class="streak-item__icon">🔥</span>
          <span class="streak-item__value">${dailyStreak}</span>
          <span class="streak-item__label">Racha diaria</span>
        </div>
        <div class="streak-item">
          <span class="streak-item__icon">✨</span>
          <span class="streak-item__value">${perfectDays}</span>
          <span class="streak-item__label">Días perfectos</span>
        </div>
      </div>

      <div class="player-profile__progress">
        <div class="progress-item">
          <span class="progress-item__label">Progreso de insignias</span>
          <div class="progress-bar">
            <div class="progress-bar__fill" style="width: ${badgeProgress}%"></div>
          </div>
          <span class="progress-item__value">${badgeProgress}%</span>
        </div>
      </div>
    </div>
  `;
}

// Renderizar leaderboard familiar
export function renderLeaderboard(container) {
  if (!container) return;

  const leaderboard = getLeaderboard();

  container.innerHTML = `
    <div class="leaderboard">
      <h3 class="leaderboard__title">🏆 Leaderboard Familiar</h3>
      <div class="leaderboard__list">
        ${leaderboard.map((player, index) => `
          <div class="leaderboard-item ${index === 0 ? 'leaderboard-item--first' : ''} ${index === 1 ? 'leaderboard-item--second' : ''} ${index === 2 ? 'leaderboard-item--third' : ''}">
            <div class="leaderboard-item__rank">
              ${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
            </div>
            <div class="leaderboard-item__avatar">${player.avatar}</div>
            <div class="leaderboard-item__info">
              <div class="leaderboard-item__name">${player.name}</div>
              <div class="leaderboard-item__level" style="color: ${player.levelInfo.color}">
                Nivel ${player.levelInfo.level} - ${player.levelInfo.name}
              </div>
            </div>
            <div class="leaderboard-item__xp">${player.xp} XP</div>
            <div class="leaderboard-item__badges">
              <span class="leaderboard-item__badge-count">🏅 ${player.badges.length}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Renderizar lista de niveles
export function renderLevelsList(container) {
  if (!container) return;

  const stats = getPlayerStats();
  const currentLevel = stats.levelInfo.level;

  container.innerHTML = `
    <div class="levels-list">
      <h3 class="levels-list__title">📊 Niveles y Recompensas</h3>
      <div class="levels-list__grid">
        ${LEVELS.map(level => `
          <div class="level-card ${level.level <= currentLevel ? 'level-card--unlocked' : 'level-card--locked'}" style="border-color: ${level.color}">
            <div class="level-card__header">
              <span class="level-card__number">${level.level}</span>
              <span class="level-card__name">${level.name}</span>
            </div>
            <div class="level-card__requirement">${level.xpRequired} XP requeridos</div>
            <div class="level-card__reward">
              <span class="level-card__reward-icon">🎁</span>
              ${level.reward}
            </div>
            ${level.level <= currentLevel ? '<div class="level-card__status">✅ Desbloqueado</div>' : '<div class="level-card__status">🔒 Bloqueado</div>'}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Renderizar notificación de nivel subido
export function showLevelUpNotification(oldLevel, newLevel) {
  const notification = document.createElement('div');
  notification.className = 'level-up-notification';
  notification.innerHTML = `
    <div class="level-up-notification__content">
      <div class="level-up-notification__icon">🎉</div>
      <h3 class="level-up-notification__title">¡Nivel Subido!</h3>
      <p class="level-up-notification__message">
        De ${oldLevel.name} (Nivel ${oldLevel.level}) a ${newLevel.name} (Nivel ${newLevel.level})
      </p>
      <div class="level-up-notification__reward">
        <span class="level-up-notification__reward-icon">🎁</span>
        Recompensa: ${newLevel.reward}
      </div>
      <button class="button button--primary level-up-notification__close">¡Genial!</button>
    </div>
  `;

  document.body.appendChild(notification);

  const closeBtn = notification.querySelector('.level-up-notification__close');
  closeBtn.addEventListener('click', () => {
    notification.remove();
  });

  // Auto cerrar después de 5 segundos
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.remove();
    }
  }, 5000);
}

// Renderizar notificación de insignia desbloqueada
export function showBadgeUnlockedNotification(badge) {
  const notification = document.createElement('div');
  notification.className = 'badge-notification';
  notification.innerHTML = `
    <div class="badge-notification__content">
      <div class="badge-notification__icon">${badge.icon}</div>
      <h3 class="badge-notification__title">¡Insignia Desbloqueada!</h3>
      <p class="badge-notification__name">${badge.name}</p>
      <p class="badge-notification__description">${badge.description}</p>
      <p class="badge-notification__xp">+${badge.xpReward} XP</p>
      <button class="button button--primary badge-notification__close">¡Awesome!</button>
    </div>
  `;

  document.body.appendChild(notification);

  const closeBtn = notification.querySelector('.badge-notification__close');
  closeBtn.addEventListener('click', () => {
    notification.remove();
  });

  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.remove();
    }
  }, 5000);
}

// Renderizar notificación de XP ganado
export function showXPGainedNotification(amount) {
  const notification = document.createElement('div');
  notification.className = 'xp-notification';
  notification.innerHTML = `
    <div class="xp-notification__content">
      <div class="xp-notification__icon">⭐</div>
      <p class="xp-notification__message">+${amount} XP</p>
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.remove();
    }
  }, 2000);
}
