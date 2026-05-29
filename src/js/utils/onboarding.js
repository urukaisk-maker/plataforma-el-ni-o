/**
 * Onboarding gamificado interactivo.
 * Se muestra la primera vez que el usuario entra a la plataforma.
 * Guía por pasos: bienvenida, avatar, mascota, primera misión.
 */

const ONBOARDING_KEY = 'elnino_onboarding_completed';

const STEPS = [
  {
    id: 'welcome',
    title: '¡Bienvenido a El Niño!',
    description: 'Vamos a preparar tu aventura gamer. Solo necesito 2 minutos.',
    emoji: '🎮',
    action: null,
  },
  {
    id: 'avatar',
    title: 'Tu Avatar',
    description: 'Elige cómo te verán los demás en la plataforma.',
    emoji: '👤',
    action: 'selectAvatar',
  },
  {
    id: 'mascot',
    title: 'Tu Mascota',
    description: 'Elige un compañero que te acompañará en tus misiones.',
    emoji: '🐉',
    action: 'selectMascot',
  },
  {
    id: 'firstMission',
    title: 'Primera Misión',
    description: 'Completa tu primera misión y gana XP de bienvenida.',
    emoji: '🎯',
    action: 'completeMission',
  },
  {
    id: 'done',
    title: '¡Listo para jugar!',
    description: 'Tu perfil está configurado. Empieza a explorar la plataforma.',
    emoji: '🚀',
    action: 'finish',
  },
];

const MASCOTS = [
  { id: 'dragon', name: 'Drako', emoji: '🐉', color: '#ff6b6b' },
  { id: 'robot', name: 'Robi', emoji: '🤖', color: '#00f5ff' },
  { id: 'cat', name: 'Michi', emoji: '🐱', color: '#ffe45c' },
  { id: 'alien', name: 'Zork', emoji: '👽', color: '#8a5cff' },
];

export function hasCompletedOnboarding() {
  return localStorage.getItem(ONBOARDING_KEY) === '1';
}

export function markOnboardingComplete() {
  localStorage.setItem(ONBOARDING_KEY, '1');
}

export function resetOnboarding() {
  localStorage.removeItem(ONBOARDING_KEY);
}

export function getMascots() {
  return MASCOTS;
}

export function saveOnboardingData(data) {
  try {
    localStorage.setItem('elnino_onboarding_data', JSON.stringify(data));
  } catch {
    // Silencioso
  }
}

export function getOnboardingData() {
  try {
    const raw = localStorage.getItem('elnino_onboarding_data');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Crea y muestra el modal de onboarding.
 * @param {function} onComplete - Callback cuando termina
 */
export function startOnboarding(onComplete) {
  if (hasCompletedOnboarding()) return;

  const overlay = document.createElement('div');
  overlay.id = 'onboardingOverlay';
  overlay.className = 'onboarding-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Tutorial de bienvenida');

  let currentStep = 0;
  const onboardingData = getOnboardingData();

  function renderStep() {
    const step = STEPS[currentStep];
    const isLast = currentStep === STEPS.length - 1;
    const progress = ((currentStep + 1) / STEPS.length) * 100;

    overlay.innerHTML = `
      <div class="onboarding-card">
        <div class="onboarding-progress">
          <div class="onboarding-progress__bar" style="width:${progress}%"></div>
        </div>
        <div class="onboarding-step">
          <div class="onboarding-step__emoji">${step.emoji}</div>
          <h2 class="onboarding-step__title">${step.title}</h2>
          <p class="onboarding-step__desc">${step.description}</p>
          ${renderAction(step.action)}
        </div>
        <div class="onboarding-actions">
          ${currentStep > 0 ? `<button class="button button--ghost onboarding-prev" type="button">Atrás</button>` : ''}
          <button class="button button--primary onboarding-next" type="button">${isLast ? '¡Empezar!' : 'Siguiente'}</button>
        </div>
        ${currentStep < STEPS.length - 1 ? `<button class="onboarding-skip" type="button">Omitir tutorial</button>` : ''}
      </div>
    `;

    bindActions();
  }

  function renderAction(action) {
    if (!action) return '';
    if (action === 'selectAvatar') {
      const avatars = ['🎮', '⚽', '🎨', '🚀', '🦄', '🐱'];
      return `
        <div class="onboarding-avatar-grid">
          ${avatars.map(a => `<button type="button" class="onboarding-avatar-btn" data-avatar="${a}">${a}</button>`).join('')}
        </div>
      `;
    }
    if (action === 'selectMascot') {
      return `
        <div class="onboarding-mascot-grid">
          ${MASCOTS.map(m => `
            <button type="button" class="onboarding-mascot-btn" data-mascot="${m.id}" style="border-color:${m.color}">
              <span style="font-size:2rem;">${m.emoji}</span>
              <strong>${m.name}</strong>
            </button>
          `).join('')}
        </div>
      `;
    }
    if (action === 'completeMission') {
      return `
        <div class="onboarding-mission-preview">
          <p style="color:var(--muted);font-size:0.9rem;">Misión: Entra a la zona de Misiones y completa la primera.</p>
          <a href="./misiones.html" class="button button--primary" style="margin-top:12px;">Ir a Misiones</a>
        </div>
      `;
    }
    return '';
  }

  function bindActions() {
    overlay.querySelector('.onboarding-next')?.addEventListener('click', () => {
      if (currentStep < STEPS.length - 1) {
        currentStep++;
        renderStep();
      } else {
        finish();
      }
    });

    overlay.querySelector('.onboarding-prev')?.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        renderStep();
      }
    });

    overlay.querySelector('.onboarding-skip')?.addEventListener('click', finish);

    overlay.querySelectorAll('.onboarding-avatar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        onboardingData.avatar = btn.dataset.avatar;
        saveOnboardingData(onboardingData);
        btn.parentElement.querySelectorAll('.onboarding-avatar-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });

    overlay.querySelectorAll('.onboarding-mascot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        onboardingData.mascot = btn.dataset.mascot;
        saveOnboardingData(onboardingData);
        btn.parentElement.querySelectorAll('.onboarding-mascot-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
  }

  function finish() {
    markOnboardingComplete();
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 300);
    if (onComplete) onComplete(onboardingData);
  }

  document.body.appendChild(overlay);
  // Animación de entrada
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
  });
  renderStep();
}
