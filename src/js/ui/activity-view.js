/**
 * Renderizador de timeline de actividad.
 */

import { getTimeline, getActivitySummary } from '../services/activity-service.js';

const ICONS = {
  mission: '🎯',
  photo: '📸',
  chat: '💬',
  comment: '💭',
  badge: '🏆',
  login: '🔥',
  video: '🎬',
  music: '🎵',
  default: '⭐',
};

function formatRelativeTime(isoDate) {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Ahora mismo';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHour < 24) return `Hace ${diffHour} h`;
  if (diffDay < 7) return `Hace ${diffDay} días`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function renderActivityTimeline(container, limit = 30) {
  if (!container) return;

  const timeline = getTimeline(limit);
  const summary = getActivitySummary();

  if (timeline.length === 0) {
    container.innerHTML = `
      <div class="activity-empty" style="text-align:center;padding:48px 24px;color:var(--muted);">
        <p style="font-size:2rem;margin-bottom:12px;">📭</p>
        <p>Aún no hay actividad registrada.</p>
        <p style="font-size:0.9rem;margin-top:8px;">Completa misiones, sube fotos o escribe en el chat para ver tu historial.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="activity-summary" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:12px;margin-bottom:32px;">
      <div class="activity-stat" style="text-align:center;padding:16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;">
        <div style="font-size:1.5rem;">📸</div>
        <strong style="color:var(--primary);font-size:1.3rem;">${summary.totalPhotos}</strong>
        <div style="font-size:0.8rem;color:var(--muted);">Fotos</div>
      </div>
      <div class="activity-stat" style="text-align:center;padding:16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;">
        <div style="font-size:1.5rem;">💬</div>
        <strong style="color:var(--primary);font-size:1.3rem;">${summary.totalMessages}</strong>
        <div style="font-size:0.8rem;color:var(--muted);">Mensajes</div>
      </div>
      <div class="activity-stat" style="text-align:center;padding:16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;">
        <div style="font-size:1.5rem;">🎯</div>
        <strong style="color:var(--primary);font-size:1.3rem;">${summary.completedMissions}</strong>
        <div style="font-size:0.8rem;color:var(--muted);">Misiones</div>
      </div>
      <div class="activity-stat" style="text-align:center;padding:16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;">
        <div style="font-size:1.5rem;">🏆</div>
        <strong style="color:var(--primary);font-size:1.3rem;">${summary.badges}</strong>
        <div style="font-size:0.8rem;color:var(--muted);">Insignias</div>
      </div>
    </div>

    <div class="activity-timeline" style="position:relative;padding-left:24px;">
      <div class="activity-timeline__line" style="position:absolute;left:11px;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,var(--primary),var(--secondary));opacity:0.3;"></div>
      ${timeline.map(evt => renderEventItem(evt)).join('')}
    </div>
  `;
}

function renderEventItem(evt) {
  const icon = ICONS[evt.type] || ICONS.default;
  const time = formatRelativeTime(evt.timestamp);

  return `
    <div class="activity-event" style="position:relative;margin-bottom:20px;padding-left:32px;">
      <div class="activity-event__dot" style="position:absolute;left:0;top:2px;width:24px;height:24px;border-radius:50%;background:rgba(0,245,255,0.15);border:2px solid var(--primary);display:grid;place-items:center;font-size:0.8rem;">
        ${icon}
      </div>
      <div class="activity-event__content" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:14px 18px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <strong style="color:var(--text);font-size:0.95rem;">${evt.title}</strong>
          <span style="font-size:0.75rem;color:var(--muted);">${time}</span>
        </div>
        <p style="margin:0;color:var(--muted);font-size:0.88rem;line-height:1.5;">${evt.description}</p>
        ${evt.xp ? `<span style="display:inline-block;margin-top:8px;padding:2px 10px;background:rgba(0,245,255,0.12);border-radius:999px;color:var(--primary);font-size:0.75rem;font-weight:700;">+${evt.xp} XP</span>` : ''}
      </div>
    </div>
  `;
}
