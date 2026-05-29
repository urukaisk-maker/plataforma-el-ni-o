// Vista de compartir - Componentes UI para compartir en redes sociales
import {
  shareContent,
  shareOnTwitter,
  shareOnFacebook,
  shareOnWhatsApp,
  shareOnLinkedIn,
  shareOnTelegram,
  copyLink,
  getAvailablePlatforms,
  generateMissionShareUrl,
  generateBadgeShareUrl,
  generateLeaderboardShareUrl,
} from '../services/social-share-service.js';

// Renderizar botones de compartir
export function renderShareButtons(container, options = {}) {
  if (!container) return;

  const { title, text, url, showLabel = false } = options;
  const platforms = getAvailablePlatforms();

  container.innerHTML = `
    <div class="share-buttons">
      <p class="share-buttons__title">Compartir</p>
      <div class="share-buttons__grid">
        ${platforms
          .map(
            platform => `
          <button 
            class="share-button share-button--${platform.id}" 
            data-platform="${platform.id}"
            title="Compartir en ${platform.name}"
          >
            <span class="share-button__icon">${getPlatformIcon(platform.id)}</span>
            ${showLabel ? `<span class="share-button__label">${platform.name}</span>` : ''}
          </button>
        `
          )
          .join('')}
      </div>
    </div>
  `;

  // Event listeners para cada botón
  container.querySelectorAll('.share-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.dataset.platform;
      handleShare(platform, { title, text, url });
    });
  });
}

// Manejar compartir según plataforma
function handleShare(platform, options) {
  switch (platform) {
    case 'native':
      shareContent(options);
      break;
    case 'twitter':
      shareOnTwitter(options);
      break;
    case 'facebook':
      shareOnFacebook(options);
      break;
    case 'whatsapp':
      shareOnWhatsApp(options);
      break;
    case 'linkedin':
      shareOnLinkedIn(options);
      break;
    case 'telegram':
      shareOnTelegram(options);
      break;
    case 'copy':
      copyLink(options).then(result => {
        if (result.success) {
          alert('¡Enlace copiado al portapapeles!');
        } else {
          alert('Error al copiar el enlace');
        }
      });
      break;
  }
}

// Obtener icono de plataforma
function getPlatformIcon(platformId) {
  const icons = {
    native: '📤',
    twitter: '𝕏',
    facebook: '📘',
    whatsapp: '💬',
    linkedin: '💼',
    telegram: '✈️',
    copy: '📋',
  };
  return icons[platformId] || '📤';
}

// Renderizar botón de compartir flotante
export function renderFloatingShareButton(container, options = {}) {
  if (!container) return;

  container.innerHTML = `
    <button class="floating-share-button" id="floatingShareBtn" title="Compartir">
      <span class="floating-share-button__icon">📤</span>
    </button>
  `;

  const shareBtn = container.querySelector('#floatingShareBtn');
  shareBtn?.addEventListener('click', () => {
    shareContent(options);
  });
}

// Renderizar botones de compartir para misión
export function renderMissionShareButtons(container, missionId, missionTitle) {
  if (!container) return;

  const { url, text } = generateMissionShareUrl(missionId, missionTitle);

  container.innerHTML = `
    <div class="share-buttons share-buttons--mission">
      <p class="share-buttons__title">¡Comparte tu logro!</p>
      <div class="share-buttons__grid">
        <button class="share-button share-button--twitter" data-platform="twitter" title="Twitter">
          <span class="share-button__icon">𝕏</span>
        </button>
        <button class="share-button share-button--whatsapp" data-platform="whatsapp" title="WhatsApp">
          <span class="share-button__icon">💬</span>
        </button>
        <button class="share-button share-button--telegram" data-platform="telegram" title="Telegram">
          <span class="share-button__icon">✈️</span>
        </button>
        <button class="share-button share-button--copy" data-platform="copy" title="Copiar enlace">
          <span class="share-button__icon">📋</span>
        </button>
      </div>
    </div>
  `;

  container.querySelectorAll('.share-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.dataset.platform;
      handleShare(platform, { text, url });
    });
  });
}

// Renderizar botones de compartir para insignia
export function renderBadgeShareButtons(container, badgeId, badgeName) {
  if (!container) return;

  const { url, text } = generateBadgeShareUrl(badgeId, badgeName);

  container.innerHTML = `
    <div class="share-buttons share-buttons--badge">
      <p class="share-buttons__title">¡Comparte tu insignia!</p>
      <div class="share-buttons__grid">
        <button class="share-button share-button--twitter" data-platform="twitter" title="Twitter">
          <span class="share-button__icon">𝕏</span>
        </button>
        <button class="share-button share-button--whatsapp" data-platform="whatsapp" title="WhatsApp">
          <span class="share-button__icon">💬</span>
        </button>
        <button class="share-button share-button--telegram" data-platform="telegram" title="Telegram">
          <span class="share-button__icon">✈️</span>
        </button>
        <button class="share-button share-button--copy" data-platform="copy" title="Copiar enlace">
          <span class="share-button__icon">📋</span>
        </button>
      </div>
    </div>
  `;

  container.querySelectorAll('.share-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.dataset.platform;
      handleShare(platform, { text, url });
    });
  });
}

// Renderizar botones de compartir para leaderboard
export function renderLeaderboardShareButtons(container, rank, xp) {
  if (!container) return;

  const { url, text } = generateLeaderboardShareUrl(rank, xp);

  container.innerHTML = `
    <div class="share-buttons share-buttons--leaderboard">
      <p class="share-buttons__title">¡Comparte tu ranking!</p>
      <div class="share-buttons__grid">
        <button class="share-button share-button--twitter" data-platform="twitter" title="Twitter">
          <span class="share-button__icon">𝕏</span>
        </button>
        <button class="share-button share-button--whatsapp" data-platform="whatsapp" title="WhatsApp">
          <span class="share-button__icon">💬</span>
        </button>
        <button class="share-button share-button--telegram" data-platform="telegram" title="Telegram">
          <span class="share-button__icon">✈️</span>
        </button>
        <button class="share-button share-button--copy" data-platform="copy" title="Copiar enlace">
          <span class="share-button__icon">📋</span>
        </button>
      </div>
    </div>
  `;

  container.querySelectorAll('.share-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.dataset.platform;
      handleShare(platform, { text, url });
    });
  });
}
