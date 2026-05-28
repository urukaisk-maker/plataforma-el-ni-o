import { missions } from "../data/missions.js";

function ensureMissionVideoModal() {
  let modal = document.querySelector("#missionVideoModal");

  if (modal) {
    return modal;
  }

  modal = document.createElement("div");
  modal.className = "video-modal";
  modal.id = "missionVideoModal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="video-modal__overlay" data-mission-video-close></div>
    <section class="video-modal__dialog video-modal__dialog--mission" role="dialog" aria-modal="true" aria-labelledby="missionVideoTitle">
      <div class="video-modal__header">
        <div>
          <p class="eyebrow">Video de misión</p>
          <h2 id="missionVideoTitle">Video seleccionado</h2>
          <p id="missionVideoDescription">Gameplay recomendado para esta misión.</p>
        </div>
        <button class="video-modal__close" type="button" aria-label="Cerrar video" data-mission-video-close>×</button>
      </div>
      <div class="video-player">
        <iframe id="missionVideoFrame" title="Video de misión" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
      <div class="video-modal__actions">
        <a class="button button--primary" id="missionVideoLink" href="./misiones.html">Ver misión completa</a>
        <button class="button button--ghost" type="button" data-mission-video-close>Cerrar</button>
      </div>
    </section>
  `;
  document.body.appendChild(modal);

  return modal;
}

function setupMissionVideos(container) {
  const modal = ensureMissionVideoModal();
  const frame = modal.querySelector("#missionVideoFrame");
  const title = modal.querySelector("#missionVideoTitle");
  const description = modal.querySelector("#missionVideoDescription");
  const link = modal.querySelector("#missionVideoLink");
  const closeButtons = modal.querySelectorAll("[data-mission-video-close]");

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    frame.removeAttribute("src");
    document.body.classList.remove("is-video-modal-open");
  }

  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mission-video]");

    if (!button) {
      return;
    }

    const mission = missions[Number(button.dataset.missionVideo)];

    title.textContent = mission.videoTitle;
    description.textContent = mission.description;
    link.href = mission.href;
    frame.src = `https://www.youtube-nocookie.com/embed/${mission.videoId}?autoplay=1&rel=0&modestbranding=1`;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-video-modal-open");
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });
}

export function renderMissions(container) {
  if (!container) {
    return;
  }

  container.innerHTML = missions
    .map((mission, index) => `
      <article>
        <h3>${mission.title}</h3>
        <p>${mission.description}</p>
        <div class="mission-card__actions">
          <button class="button button--primary" type="button" data-mission-video="${index}">Ver video</button>
          <a class="button button--ghost" href="${mission.href}">Ver misión</a>
        </div>
      </article>
    `)
    .join("");

  setupMissionVideos(container);
}
