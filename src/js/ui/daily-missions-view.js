// Vista de misiones diarias y semanales - Componentes UI para mostrar y gestionar misiones
import {
  getPlayerStats,
  updateDailyMissionProgress,
  updateWeeklyMissionProgress,
  dailyLogin,
} from '../services/gamification-service.js';

// Renderizar misiones diarias
export function renderDailyMissions(container) {
  if (!container) return;

  const stats = getPlayerStats();
  const { dailyMissions, dailyStreak } = stats;

  container.innerHTML = `
    <div class="daily-missions">
      <div class="daily-missions__header">
        <h3 class="daily-missions__title">📋 Misiones Diarias</h3>
        <div class="daily-missions__streak">
          <span class="daily-missions__streak-icon">🔥</span>
          <span class="daily-missions__streak-value">${dailyStreak}</span>
          <span class="daily-missions__streak-label">días</span>
        </div>
      </div>
      <div class="daily-missions__list">
        ${
          dailyMissions.length === 0
            ? `
          <div class="daily-missions__empty">
            <p>Inicia sesión para cargar las misiones diarias</p>
            <button class="button button--primary daily-missions__login" id="dailyLoginBtn">Iniciar Sesión</button>
          </div>
        `
            : dailyMissions
                .map(
                  mission => `
          <div class="daily-mission-item ${mission.completed ? 'daily-mission-item--completed' : ''}" data-mission-id="${mission.id}">
            <div class="daily-mission-item__icon">${mission.icon}</div>
            <div class="daily-mission-item__info">
              <h4 class="daily-mission-item__name">${mission.name}</h4>
              <p class="daily-mission-item__description">${mission.description}</p>
              <div class="daily-mission-item__reward">+${mission.xpReward} XP</div>
            </div>
            <div class="daily-mission-item__status">
              ${mission.completed ? '✅' : '⬜'}
            </div>
          </div>
        `
                )
                .join('')
        }
      </div>
      ${
        dailyMissions.length > 0
          ? `
        <div class="daily-missions__progress">
          <span class="daily-missions__completed">${dailyMissions.filter(m => m.completed).length}</span>
          <span class="daily-missions__total">de ${dailyMissions.length}</span>
          <span class="daily-missions__label">completadas</span>
        </div>
      `
          : ''
      }
    </div>
  `;

  // Añadir event listener para botón de login
  const loginBtn = container.querySelector('#dailyLoginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      dailyLogin();
      renderDailyMissions(container);
    });
  }
}

// Renderizar misiones semanales
export function renderWeeklyMissions(container) {
  if (!container) return;

  const stats = getPlayerStats();
  const { weeklyMissions } = stats;

  container.innerHTML = `
    <div class="weekly-missions">
      <div class="weekly-missions__header">
        <h3 class="weekly-missions__title">📅 Misiones Semanales</h3>
        <div class="weekly-missions__timer">
          <span class="weekly-missions__timer-label">Resetea en:</span>
          <span class="weekly-missions__timer-value" id="weeklyTimer">--:--:--</span>
        </div>
      </div>
      <div class="weekly-missions__list">
        ${
          weeklyMissions.length === 0
            ? `
          <div class="weekly-missions__empty">
            <p>Las misiones semanales se cargarán al iniciar sesión</p>
          </div>
        `
            : weeklyMissions
                .map(
                  mission => `
          <div class="weekly-mission-item ${mission.completed ? 'weekly-mission-item--completed' : ''}" data-mission-id="${mission.id}">
            <div class="weekly-mission-item__icon">${mission.icon}</div>
            <div class="weekly-mission-item__info">
              <h4 class="weekly-mission-item__name">${mission.name}</h4>
              <p class="weekly-mission-item__description">${mission.description}</p>
              <div class="weekly-mission-item__progress">
                <div class="weekly-mission-item__progress-bar">
                  <div class="weekly-mission-item__progress-fill" style="width: ${Math.min((mission.progress / mission.target) * 100, 100)}%"></div>
                </div>
                <span class="weekly-mission-item__progress-text">${mission.progress}/${mission.target}</span>
              </div>
              <div class="weekly-mission-item__reward">+${mission.xpReward} XP</div>
            </div>
            <div class="weekly-mission-item__status">
              ${mission.completed ? '✅' : '⬜'}
            </div>
          </div>
        `
                )
                .join('')
        }
      </div>
      ${
        weeklyMissions.length > 0
          ? `
        <div class="weekly-missions__progress">
          <span class="weekly-missions__completed">${weeklyMissions.filter(m => m.completed).length}</span>
          <span class="weekly-missions__total">de ${weeklyMissions.length}</span>
          <span class="weekly-missions__label">completadas</span>
        </div>
      `
          : ''
      }
    </div>
  `;

  // Iniciar timer para reset semanal
  startWeeklyTimer();
}

// Renderizar panel combinado de misiones
export function renderMissionsPanel(container) {
  if (!container) return;

  container.innerHTML = `
    <div class="missions-panel">
      <div class="missions-panel__daily" id="dailyMissionsContainer"></div>
      <div class="missions-panel__weekly" id="weeklyMissionsContainer"></div>
    </div>
  `;

  renderDailyMissions(container.querySelector('#dailyMissionsContainer'));
  renderWeeklyMissions(container.querySelector('#weeklyMissionsContainer'));
}

// Renderizar tarjeta de misión individual
export function renderMissionCard(container, mission, type = 'daily') {
  if (!container) return;

  const isCompleted = mission.completed;
  const progress = type === 'weekly' ? `${mission.progress}/${mission.target}` : isCompleted ? '1/1' : '0/1';

  container.innerHTML = `
    <div class="mission-card ${isCompleted ? 'mission-card--completed' : ''}">
      <div class="mission-card__icon">${mission.icon}</div>
      <div class="mission-card__content">
        <h4 class="mission-card__name">${mission.name}</h4>
        <p class="mission-card__description">${mission.description}</p>
        <div class="mission-card__progress">
          <span class="mission-card__progress-text">${progress}</span>
        </div>
        <div class="mission-card__reward">+${mission.xpReward} XP</div>
      </div>
      <div class="mission-card__status">
        ${isCompleted ? '✅ Completada' : '⬜ Pendiente'}
      </div>
    </div>
  `;
}

// Mostrar notificación de misión completada
export function showMissionCompletedNotification(mission, xpGained) {
  const notification = document.createElement('div');
  notification.className = 'mission-completed-notification';
  notification.innerHTML = `
    <div class="mission-completed-notification__content">
      <div class="mission-completed-notification__icon">✅</div>
      <h3 class="mission-completed-notification__title">¡Misión Completada!</h3>
      <p class="mission-completed-notification__name">${mission.name}</p>
      <p class="mission-completed-notification__xp">+${xpGained} XP</p>
      <button class="button button--primary mission-completed-notification__close">¡Genial!</button>
    </div>
  `;

  document.body.appendChild(notification);

  const closeBtn = notification.querySelector('.mission-completed-notification__close');
  closeBtn.addEventListener('click', () => {
    notification.remove();
  });

  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.remove();
    }
  }, 4000);
}

// Mostrar notificación de racha diaria
export function showStreakNotification(streak) {
  const notification = document.createElement('div');
  notification.className = 'streak-notification';
  notification.innerHTML = `
    <div class="streak-notification__content">
      <div class="streak-notification__icon">🔥</div>
      <h3 class="streak-notification__title">¡Racha de ${streak} días!</h3>
      <p class="streak-notification__message">Sigue así para desbloquear insignias especiales</p>
      <button class="button button--primary streak-notification__close">¡Vamos!</button>
    </div>
  `;

  document.body.appendChild(notification);

  const closeBtn = notification.querySelector('.streak-notification__close');
  closeBtn.addEventListener('click', () => {
    notification.remove();
  });

  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.remove();
    }
  }, 4000);
}

// Iniciar timer para reset semanal
function startWeeklyTimer() {
  const timerElement = document.getElementById('weeklyTimer');
  if (!timerElement) return;

  const updateTimer = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;

    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + daysUntilMonday);
    nextMonday.setHours(0, 0, 0, 0);

    const diff = nextMonday - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  updateTimer();
  setInterval(updateTimer, 1000);
}

// Actualizar progreso de misión diaria (para uso externo)
export function completeDailyMission(missionId) {
  const result = updateDailyMissionProgress(missionId, 1);
  return result;
}

// Actualizar progreso de misión semanal (para uso externo)
export function completeWeeklyMission(missionId, progress = 1) {
  const result = updateWeeklyMissionProgress(missionId, progress);
  return result;
}
