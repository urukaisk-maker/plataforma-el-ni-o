/**
 * Panel de privacidad para padres.
 * Control granular de datos, exportacion y borrado total.
 */

import { exportAllData } from '../utils/data-portability.js';
import { getConsentStatus, revokeConsent } from '../services/parental-consent.js';
import { formatDate } from '../utils/i18n.js';

const PRIVACY_SETTINGS_KEY = 'elnino_privacy_settings';

const DEFAULT_SETTINGS = {
  allowAnalytics: false,
  allowActivityLog: true,
  allowGamification: true,
  allowSocialFeatures: false,
  allowPhotoUpload: false,
  allowTutorAI: true,
  allowPushNotifications: false,
  dataRetentionDays: 365,
};

export function getPrivacySettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(PRIVACY_SETTINGS_KEY)) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function setPrivacySettings(settings) {
  localStorage.setItem(PRIVACY_SETTINGS_KEY, JSON.stringify(settings));
}

export function renderPrivacyPanel(container) {
  if (!container) return;

  const settings = getPrivacySettings();
  const consent = getConsentStatus();
  const consentDate = consent?.verifiedAt ? formatDate(consent.verifiedAt) : 'Pendiente';

  container.innerHTML = `
    <section class="content-panel privacy-panel">
      <h2 class="section-title">Panel de Privacidad</h2>
      <p class="privacy-intro">Controla que datos se recogen y como se usan. Puedes exportar todo o eliminarlo permanentemente.</p>

      <div class="privacy-group">
        <h3>Consentimiento parental</h3>
        <div class="privacy-item">
          <div>
            <strong>Estado:</strong> ${consent?.approved ? 'Verificado' : 'Pendiente'}
          </div>
          <div class="privacy-meta">Fecha: ${consentDate}</div>
        </div>
      </div>

      <div class="privacy-group">
        <h3>Control de datos recogidos</h3>
        ${renderToggle('allowAnalytics', settings.allowAnalytics, 'Analitica anonima', 'Datos agregados sin identificacion personal')}
        ${renderToggle('allowActivityLog', settings.allowActivityLog, 'Registro de actividad', 'Misiones completadas, progreso y logros')}
        ${renderToggle('allowGamification', settings.allowGamification, 'Gamificacion', 'XP, niveles, insignias y rachas')}
        ${renderToggle('allowSocialFeatures', settings.allowSocialFeatures, 'Funciones sociales', 'Fotos, chat y leaderboard')}
        ${renderToggle('allowPhotoUpload', settings.allowPhotoUpload, 'Subida de fotos', 'Permite guardar imagenes en la plataforma')}
        ${renderToggle('allowTutorAI', settings.allowTutorAI, 'Tutor IA', 'Conversaciones con el tutor inteligente')}
        ${renderToggle('allowPushNotifications', settings.allowPushNotifications, 'Notificaciones push', 'Recordatorios y alertas del navegador')}
      </div>

      <div class="privacy-group">
        <h3>Retencion de datos</h3>
        <label class="privacy-label">
          Eliminar datos automaticamente despues de:
          <select class="privacy-select" id="retentionSelect">
            <option value="30" ${settings.dataRetentionDays === 30 ? 'selected' : ''}>30 dias</option>
            <option value="90" ${settings.dataRetentionDays === 90 ? 'selected' : ''}>90 dias</option>
            <option value="180" ${settings.dataRetentionDays === 180 ? 'selected' : ''}>6 meses</option>
            <option value="365" ${settings.dataRetentionDays === 365 ? 'selected' : ''}>1 ano</option>
            <option value="0" ${settings.dataRetentionDays === 0 ? 'selected' : ''}>Nunca (manual)</option>
          </select>
        </label>
      </div>

      <div class="privacy-group privacy-actions">
        <h3>Acciones de datos</h3>
        <button class="button button--primary" id="exportDataBtn">
          Descargar todos mis datos (JSON)
        </button>
        <button class="button button--danger" id="deleteAllBtn">
          Borrar todos mis datos permanentemente
        </button>
        <p class="privacy-warning">El borrado es irreversible. Se eliminan progreso, fotos, historial y configuracion.</p>
      </div>
    </section>
  `;

  bindPrivacyEvents(container);
}

function renderToggle(key, value, title, description) {
  return `
    <label class="privacy-toggle">
      <input type="checkbox" data-setting="${key}" ${value ? 'checked' : ''} />
      <span class="privacy-toggle__track">
        <span class="privacy-toggle__thumb"></span>
      </span>
      <span class="privacy-toggle__info">
        <strong>${title}</strong>
        <span>${description}</span>
      </span>
    </label>
  `;
}

function bindPrivacyEvents(container) {
  // Toggles
  container.querySelectorAll('[data-setting]').forEach(input => {
    input.addEventListener('change', () => {
      const settings = getPrivacySettings();
      settings[input.dataset.setting] = input.checked;
      setPrivacySettings(settings);
    });
  });

  // Retention
  container.querySelector('#retentionSelect')?.addEventListener('change', e => {
    const settings = getPrivacySettings();
    settings.dataRetentionDays = parseInt(e.target.value, 10);
    setPrivacySettings(settings);
  });

  // Export
  container.querySelector('#exportDataBtn')?.addEventListener('click', () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elnino-datos-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Delete all
  container.querySelector('#deleteAllBtn')?.addEventListener('click', () => {
    if (confirm('Estas seguro? Esta accion elimina TODOS los datos de forma permanente.')) {
      if (confirm('CONFIRMACION FINAL: Escribe BORRAR para confirmar.')) {
        localStorage.clear();
        revokeConsent();
        alert('Todos los datos han sido eliminados. La pagina se recargara.');
        window.location.reload();
      }
    }
  });
}
