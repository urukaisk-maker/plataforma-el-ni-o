/**
 * Selector de idioma para la UI.
 * Persistente via localStorage.
 */

import { getAvailableLocales, getCurrentLocale, loadLocale } from '../utils/i18n.js';

export function renderLanguageSelector(container) {
  if (!container) return;

  const locales = getAvailableLocales();
  const current = getCurrentLocale();

  container.innerHTML = `
    <div class="lang-selector">
      <button class="lang-selector__trigger" id="langTrigger" aria-label="Cambiar idioma" aria-expanded="false">
        <span class="lang-selector__flag">${locales.find(l => l.code === current)?.flag || '🌐'}</span>
        <span class="lang-selector__label">${locales.find(l => l.code === current)?.label || current}</span>
        <span class="lang-selector__arrow">▼</span>
      </button>
      <ul class="lang-selector__dropdown" id="langDropdown" role="listbox" hidden>
        ${locales.map(l => `
          <li role="option" class="lang-selector__option ${l.code === current ? 'active' : ''}" data-locale="${l.code}">
            <span class="lang-selector__flag">${l.flag}</span>
            <span>${l.label}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `;

  const trigger = container.querySelector('#langTrigger');
  const dropdown = container.querySelector('#langDropdown');

  trigger?.addEventListener('click', () => {
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', !expanded);
    dropdown.hidden = expanded;
  });

  container.querySelectorAll('.lang-selector__option').forEach(opt => {
    opt.addEventListener('click', async () => {
      const locale = opt.dataset.locale;
      if (locale === current) return;
      await loadLocale(locale);
      window.location.reload();
    });
  });

  // Cerrar al click fuera
  document.addEventListener('click', e => {
    if (!container.contains(e.target)) {
      trigger?.setAttribute('aria-expanded', 'false');
      if (dropdown) dropdown.hidden = true;
    }
  });
}
