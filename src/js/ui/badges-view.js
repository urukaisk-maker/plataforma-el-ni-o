// Vista de insignias/achievements - Componentes UI para mostrar logros desbloqueados
import { getPlayerStats } from "../services/gamification-service.js";
import { BADGES } from "../data/gamification.js";

// Renderizar cuadrícula de insignias
export function renderBadgesGrid(container) {
  if (!container) return;

  const stats = getPlayerStats();
  const { player, unlockedBadges } = stats;
  const unlockedBadgeIds = new Set(player.badges);

  container.innerHTML = `
    <div class="badges-grid">
      <h3 class="badges-grid__title">🏅 Insignias y Logros</h3>
      <div class="badges-grid__stats">
        <span class="badges-grid__stat">${unlockedBadges.length} de ${BADGES.length} desbloqueadas</span>
      </div>
      <div class="badges-grid__items">
        ${BADGES.map(badge => {
          const isUnlocked = unlockedBadgeIds.has(badge.id);
          return `
            <div class="badge-card ${isUnlocked ? 'badge-card--unlocked' : 'badge-card--locked'}">
              <div class="badge-card__icon">${isUnlocked ? badge.icon : '🔒'}</div>
              <div class="badge-card__info">
                <h4 class="badge-card__name">${badge.name}</h4>
                <p class="badge-card__description">${badge.description}</p>
                <div class="badge-card__reward">+${badge.xpReward} XP</div>
              </div>
              ${isUnlocked ? '<div class="badge-card__status">✅</div>' : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// Renderizar insignias desbloqueadas recientemente
export function renderRecentBadges(container, limit = 3) {
  if (!container) return;

  const stats = getPlayerStats();
  const { player } = stats;
  const unlockedBadgeIds = new Set(player.badges);
  
  const unlockedBadges = BADGES.filter(badge => unlockedBadgeIds.has(badge.id));
  const recentBadges = unlockedBadges.slice(-limit).reverse();

  if (recentBadges.length === 0) {
    container.innerHTML = `
      <div class="recent-badges recent-badges--empty">
        <p class="recent-badges__empty">Aún no has desbloqueado insignias. ¡Completa misiones para obtener tu primera!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="recent-badges">
      <h3 class="recent-badges__title">🎖️ Insignias Recientes</h3>
      <div class="recent-badges__list">
        ${recentBadges.map(badge => `
          <div class="recent-badge-item">
            <div class="recent-badge-item__icon">${badge.icon}</div>
            <div class="recent-badge-item__info">
              <h4 class="recent-badge-item__name">${badge.name}</h4>
              <p class="recent-badge-item__description">${badge.description}</p>
            </div>
            <div class="recent-badge-item__xp">+${badge.xpReward} XP</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Renderizar progreso de insignias
export function renderBadgesProgress(container) {
  if (!container) return;

  const stats = getPlayerStats();
  const { badgeProgress, unlockedBadges } = stats;

  container.innerHTML = `
    <div class="badges-progress">
      <h3 class="badges-progress__title">📊 Progreso de Insignias</h3>
      <div class="badges-progress__bar">
        <div class="badges-progress__fill" style="width: ${badgeProgress}%"></div>
      </div>
      <div class="badges-progress__info">
        <span class="badges-progress__unlocked">${unlockedBadges.length} desbloqueadas</span>
        <span class="badges-progress__total">de ${BADGES.length} totales</span>
        <span class="badges-progress__percent">${badgeProgress}%</span>
      </div>
    </div>
  `;
}

// Renderizar detalle de una insignia específica
export function renderBadgeDetail(container, badgeId) {
  if (!container) return;

  const badge = BADGES.find(b => b.id === badgeId);
  if (!badge) {
    container.innerHTML = '<p>Insignia no encontrada</p>';
    return;
  }

  const stats = getPlayerStats();
  const isUnlocked = stats.player.badges.includes(badgeId);

  container.innerHTML = `
    <div class="badge-detail">
      <div class="badge-detail__header">
        <div class="badge-detail__icon">${isUnlocked ? badge.icon : '🔒'}</div>
        <div class="badge-detail__info">
          <h2 class="badge-detail__name">${badge.name}</h2>
          <div class="badge-detail__status ${isUnlocked ? 'badge-detail__status--unlocked' : 'badge-detail__status--locked'}">
            ${isUnlocked ? '✅ Desbloqueada' : '🔒 Bloqueada'}
          </div>
        </div>
      </div>
      <div class="badge-detail__description">
        <p>${badge.description}</p>
      </div>
      <div class="badge-detail__reward">
        <span class="badge-detail__reward-icon">⭐</span>
        Recompensa: ${badge.xpReward} XP
      </div>
      ${!isUnlocked ? `
        <div class="badge-detail__hint">
          <p>💡 Sigue completando misiones y actividades para desbloquear esta insignia</p>
        </div>
      ` : ''}
    </div>
  `;
}

// Renderizar insignias filtradas por categoría
export function renderBadgesByCategory(container, category) {
  if (!container) return;

  const stats = getPlayerStats();
  const { player } = stats;
  const unlockedBadgeIds = new Set(player.badges);

  // Filtrar insignias por categoría (basado en el tipo de condición)
  const categoryBadges = BADGES.filter(badge => {
    if (category === 'missions') return badge.id.includes('mission');
    if (category === 'daily') return badge.id.includes('daily') || badge.id.includes('streak');
    if (category === 'content') return badge.id.includes('memory') || badge.id.includes('youtube') || badge.id.includes('music');
    if (category === 'level') return badge.id.includes('level');
    return true;
  });

  container.innerHTML = `
    <div class="badges-category">
      <h3 class="badges-category__title">${getCategoryTitle(category)}</h3>
      <div class="badges-category__items">
        ${categoryBadges.map(badge => {
          const isUnlocked = unlockedBadgeIds.has(badge.id);
          return `
            <div class="badge-card ${isUnlocked ? 'badge-card--unlocked' : 'badge-card--locked'}">
              <div class="badge-card__icon">${isUnlocked ? badge.icon : '🔒'}</div>
              <div class="badge-card__info">
                <h4 class="badge-card__name">${badge.name}</h4>
                <p class="badge-card__description">${badge.description}</p>
                <div class="badge-card__reward">+${badge.xpReward} XP</div>
              </div>
              ${isUnlocked ? '<div class="badge-card__status">✅</div>' : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// Función auxiliar para obtener título de categoría
function getCategoryTitle(category) {
  const titles = {
    missions: '🎯 Insignias de Misiones',
    daily: '🔥 Insignias Diarias',
    content: '📺 Insignias de Contenido',
    level: '🌟 Insignias de Nivel',
    all: '🏅 Todas las Insignias'
  };
  return titles[category] || titles.all;
}
