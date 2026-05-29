import { memories } from '../data/memories.js';

function ensureMemoryModal() {
  let modal = document.querySelector('#memoryModal');

  if (modal) {
    return modal;
  }

  modal = document.createElement('div');
  modal.className = 'video-modal memory-modal';
  modal.id = 'memoryModal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="video-modal__overlay" data-memory-close></div>
    <section class="video-modal__dialog memory-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="memoryModalTitle">
      <div class="video-modal__header">
        <div>
          <p class="eyebrow" id="memoryModalType">Recuerdo desbloqueado</p>
          <h2 id="memoryModalTitle">Recuerdo seleccionado</h2>
          <p id="memoryModalDescription">Historia especial de la campaña.</p>
        </div>
        <button class="video-modal__close" type="button" aria-label="Cerrar recuerdo" data-memory-close>×</button>
      </div>
      <div class="memory-modal__body">
        <div class="memory-modal__icon" id="memoryModalIcon">🎮</div>
        <div>
          <h3>Historia del recuerdo</h3>
          <p id="memoryModalStory"></p>
          <strong id="memoryModalReward"></strong>
        </div>
      </div>
      <div class="video-player memory-modal__player">
        <iframe id="memoryModalFrame" title="Video del recuerdo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
      <div class="video-modal__actions">
        <a class="button button--primary" href="./recuerdos.html">Ver galería completa</a>
        <button class="button button--ghost" type="button" data-memory-close>Cerrar</button>
      </div>
    </section>
  `;
  document.body.appendChild(modal);

  return modal;
}

function setupMemoryModal(container) {
  const modal = ensureMemoryModal();
  const title = modal.querySelector('#memoryModalTitle');
  const type = modal.querySelector('#memoryModalType');
  const description = modal.querySelector('#memoryModalDescription');
  const icon = modal.querySelector('#memoryModalIcon');
  const story = modal.querySelector('#memoryModalStory');
  const reward = modal.querySelector('#memoryModalReward');
  const frame = modal.querySelector('#memoryModalFrame');
  const closeButtons = modal.querySelectorAll('[data-memory-close]');

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    frame.removeAttribute('src');
    document.body.classList.remove('is-video-modal-open');
  }

  container.addEventListener('click', event => {
    const button = event.target.closest('[data-memory-index]');

    if (!button) {
      return;
    }

    const memory = memories[Number(button.dataset.memoryIndex)];

    title.textContent = memory.title;
    type.textContent = memory.type;
    description.textContent = memory.description;
    icon.textContent = memory.icon;
    story.textContent = memory.story;
    reward.textContent = memory.reward;
    frame.src = memory.videoId
      ? `https://www.youtube-nocookie.com/embed/${memory.videoId}?autoplay=1&rel=0&modestbranding=1`
      : '';
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-video-modal-open');
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });
}

export function renderMemories(container, options = {}) {
  if (!container) {
    return;
  }

  const visibleMemories = memories.slice(0, options.limit ?? memories.length);

  container.innerHTML = visibleMemories
    .map(
      (memory, index) => `
      <article class="memory-card">
        <span class="memory-card__icon">${memory.icon}</span>
        <small>${memory.type}</small>
        <h3>${memory.title}</h3>
        <p>${memory.description}</p>
        <button class="button button--ghost" type="button" data-memory-index="${index}">${memory.videoId ? 'Ver video' : 'Abrir recuerdo'}</button>
      </article>
    `
    )
    .join('');

  setupMemoryModal(container);
}
