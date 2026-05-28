// Servicio de compartir en redes sociales
// URL de la aplicación
const APP_URL = window.location.origin;
const APP_NAME = 'El Niño - Plataforma Gamer';

// Función para compartir usando Web Share API (navegadores modernos)
export async function shareContent(options) {
  const { title, text, url } = options;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: title || APP_NAME,
        text: text || '¡Mira esta plataforma gamer increíble!',
        url: url || APP_URL
      });
      return { success: true };
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error al compartir:', error);
        return { success: false, error: error.message };
      }
      return { success: false, error: 'Compartir cancelado' };
    }
  } else {
    // Fallback para navegadores que no soportan Web Share API
    return shareFallback(options);
  }
}

// Fallback para compartir en navegadores antiguos
function shareFallback(options) {
  const { title, text, url } = options;
  const shareUrl = url || APP_URL;
  const shareText = encodeURIComponent(text || '¡Mira esta plataforma gamer increíble!');
  const shareTitle = encodeURIComponent(title || APP_NAME);
  
  // Abrir ventana de compartir genérica
  const shareWindow = window.open(
    `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`,
    '_blank',
    'width=600,height=400'
  );
  
  if (shareWindow) {
    return { success: true };
  }
  
  return { success: false, error: 'No se pudo abrir la ventana de compartir' };
}

// Compartir en Twitter/X
export function shareOnTwitter(options) {
  const { text, url } = options;
  const shareUrl = url || APP_URL;
  const shareText = encodeURIComponent(text || '¡Mira esta plataforma gamer increíble!');
  
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`;
  window.open(twitterUrl, '_blank', 'width=600,height=400');
  
  return { success: true };
}

// Compartir en Facebook
export function shareOnFacebook(options) {
  const { url } = options;
  const shareUrl = url || APP_URL;
  
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  window.open(facebookUrl, '_blank', 'width=600,height=400');
  
  return { success: true };
}

// Compartir en WhatsApp
export function shareOnWhatsApp(options) {
  const { text, url } = options;
  const shareUrl = url || APP_URL;
  const shareText = encodeURIComponent(`${text || '¡Mira esta plataforma gamer increíble!'} ${shareUrl}`);
  
  const whatsappUrl = `https://wa.me/?text=${shareText}`;
  window.open(whatsappUrl, '_blank');
  
  return { success: true };
}

// Compartir en LinkedIn
export function shareOnLinkedIn(options) {
  const { title, url } = options;
  const shareUrl = url || APP_URL;
  const shareTitle = encodeURIComponent(title || APP_NAME);
  
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${shareTitle}`;
  window.open(linkedinUrl, '_blank', 'width=600,height=400');
  
  return { success: true };
}

// Compartir en Telegram
export function shareOnTelegram(options) {
  const { text, url } = options;
  const shareUrl = url || APP_URL;
  const shareText = encodeURIComponent(`${text || '¡Mira esta plataforma gamer increíble!'} ${shareUrl}`);
  
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${shareText}`;
  window.open(telegramUrl, '_blank');
  
  return { success: true };
}

// Copiar enlace al portapapeles
export async function copyLink(options) {
  const { url } = options;
  const shareUrl = url || APP_URL;
  
  try {
    await navigator.clipboard.writeText(shareUrl);
    return { success: true };
  } catch (error) {
    // Fallback para navegadores antiguos
    const textArea = document.createElement('textarea');
    textArea.value = shareUrl;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return { success: true };
    } catch (err) {
      document.body.removeChild(textArea);
      return { success: false, error: 'No se pudo copiar el enlace' };
    }
  }
}

// Generar enlace de compartir para una misión específica
export function generateMissionShareUrl(missionId, missionTitle) {
  const url = `${APP_URL}/misiones.html#mission-${missionId}`;
  const text = `¡Acabo de completar la misión "${missionTitle}" en El Niño! 🎮`;
  
  return { url, text };
}

// Generar enlace de compartir para una insignia
export function generateBadgeShareUrl(badgeId, badgeName) {
  const url = `${APP_URL}/insignias.html#badge-${badgeId}`;
  const text = `¡Desbloqueé la insignia "${badgeName}" en El Niño! 🏆`;
  
  return { url, text };
}

// Generar enlace de compartir para el leaderboard
export function generateLeaderboardShareUrl(rank, xp) {
  const url = `${APP_URL}/leaderboard.html`;
  const text = `¡Estoy en el puesto #${rank} con ${xp} XP en el leaderboard de El Niño! 🏆`;
  
  return { url, text };
}

// Verificar si Web Share API está disponible
export function isWebShareAvailable() {
  return typeof navigator !== 'undefined' && navigator.share !== undefined;
}

// Obtener plataformas de compartir disponibles
export function getAvailablePlatforms() {
  const platforms = [
    { id: 'native', name: 'Compartir', available: isWebShareAvailable() },
    { id: 'twitter', name: 'Twitter/X', available: true },
    { id: 'facebook', name: 'Facebook', available: true },
    { id: 'whatsapp', name: 'WhatsApp', available: true },
    { id: 'linkedin', name: 'LinkedIn', available: true },
    { id: 'telegram', name: 'Telegram', available: true },
    { id: 'copy', name: 'Copiar enlace', available: true }
  ];
  
  return platforms.filter(p => p.available);
}
