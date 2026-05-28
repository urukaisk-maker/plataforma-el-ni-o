import { renderMissions } from "./ui/missions-view.js";
import { renderMemories } from "./ui/memories-view.js";
import { renderYoutubeResults } from "./ui/youtube-view.js";


const missionsList = document.querySelector("#missionsList");
const surpriseButton = document.querySelector("#surpriseButton");
const surpriseMessage = document.querySelector("#surpriseMessage");
const youtubeResults = document.querySelector("#youtubeResults");
const youtubeStatus = document.querySelector("#youtubeStatus");
const memoriesList = document.querySelector("#memoriesList");
const countdownModal = document.querySelector("#birthdayModal");
const countdownTimer = document.querySelector("#countdownTimer");
const surpriseCountdownTimer = document.querySelector("#surpriseCountdownTimer");
const closeCountdownButton = document.querySelector("#closeCountdownButton");
const closeCountdownAction = document.querySelector("#closeCountdownAction");
const closeCountdownOverlay = document.querySelector("#closeCountdownOverlay");
const audioButtons = document.querySelectorAll(".music-control");
const introAudio = document.querySelector("#introAudio");
const unlockButton = document.querySelector("#unlockButton");
const navToggle = document.querySelector("#navToggle");
const mainNav = document.querySelector(".main-nav");
const siteHeader = document.querySelector(".site-header");

const adminModal = document.querySelector("#adminModal");
const adminSecretInput = document.querySelector("#adminSecretInput");
const adminUnlockAction = document.querySelector("#adminUnlockAction");
const adminCancelAction = document.querySelector("#adminCancelAction");
const closeAdminButton = document.querySelector("#closeAdminButton");
const closeAdminOverlay = document.querySelector("#closeAdminOverlay");
const adminMessage = document.querySelector("#adminMessage");

// Clave por defecto (edítala si lo deseas). Manténla privada.
const OWNER_SECRET = "ELNINO-ADMIN-24JUN";

// acceso secreto: clic en la marca varias veces para abrir el modal
const brand = document.querySelector(".brand");
let brandClicks = 0;
brand?.addEventListener("click", () => {
  brandClicks++;
  if (brandClicks >= 7) {
    if (adminModal) {
      adminModal.setAttribute("aria-hidden", "false");
      adminModal.style.display = "grid";
      if (adminSecretInput) adminSecretInput.value = "";
      if (adminMessage) adminMessage.textContent = "";
    }
    brandClicks = 0;
  }
  setTimeout(() => (brandClicks = 0), 3000);
});

adminUnlockAction?.addEventListener("click", () => {
  const val = adminSecretInput?.value || "";
  if (val === OWNER_SECRET) {
    localStorage.setItem("elnino_owner", "1");
    if (adminMessage) adminMessage.textContent = "Acceso concedido. Sorpresa desbloqueada.";
    if (adminModal) {
      adminModal.setAttribute("aria-hidden", "true");
      adminModal.style.display = "none";
    }
    showUnlockButton();
    unlockSurpriseButton();
  } else {
    if (adminMessage) adminMessage.textContent = "Clave incorrecta.";
  }
});

adminCancelAction?.addEventListener("click", () => {
  if (adminModal) {
    adminModal.setAttribute("aria-hidden", "true");
    adminModal.style.display = "none";
  }
});

closeAdminButton?.addEventListener("click", () => {
  if (adminModal) {
    adminModal.setAttribute("aria-hidden", "true");
    adminModal.style.display = "none";
  }
});

closeAdminOverlay?.addEventListener("click", () => {
  if (adminModal) {
    adminModal.setAttribute("aria-hidden", "true");
    adminModal.style.display = "none";
  }
});

const birthdayDate = new Date("2026-06-24T00:00:00");

// si este navegador ya fue marcado como propietario, desbloquea
const isOwner = localStorage.getItem("elnino_owner") === "1";
if (isOwner) {
  showUnlockButton();
  unlockSurpriseButton();
}

function formatTime(value) {
  return String(value).padStart(2, "0");
}

function getCountdownText() {
  const now = Date.now();
  const diff = birthdayDate.getTime() - now;

  if (diff <= 0) {
    return "¡Hoy es el gran cumpleaños de El Niño!";
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return `${formatTime(days)}d ${formatTime(hours)}h ${formatTime(minutes)}m ${formatTime(seconds)}s`;
}

function refreshCountdown() {
  const text = getCountdownText();

  if (countdownTimer) {
    countdownTimer.textContent = text;
  }

  if (surpriseCountdownTimer) {
    surpriseCountdownTimer.textContent = `Cuenta regresiva: ${text}`;
  }
}

function showUnlockButton() {
  if (!unlockButton) return;
  unlockButton.hidden = false;
  unlockButton.setAttribute("aria-hidden", "false");
}

function unlockSurpriseButton() {
  if (!surpriseButton) return;
  surpriseButton.classList.remove("button--disabled");
  surpriseButton.setAttribute("aria-disabled", "false");
  surpriseButton.textContent = "Abrir regalo digital";
  surpriseButton.href = "./regalo-digital.html";
}

function isCountdownComplete() {
  return Date.now() >= birthdayDate.getTime();
}

function hideCountdownModal() {
  if (!countdownModal) return;
  countdownModal.setAttribute("aria-hidden", "true");
  countdownModal.style.display = "none";

  if (surpriseMessage) {
    if (isCountdownComplete()) {
      surpriseMessage.textContent = "¡Ya puedes abrir la sorpresa cuando quieras!";
    } else {
      surpriseMessage.textContent = "Puedes seguir explorando. La sorpresa se desbloqueará cuando termine la cuenta regresiva.";
    }
  }
}

if (countdownModal) {
  refreshCountdown();
  const countdownInterval = setInterval(() => {
    refreshCountdown();

    if (Date.now() >= birthdayDate.getTime()) {
      clearInterval(countdownInterval);
      if (countdownTimer) {
        countdownTimer.textContent = "¡Ya es el gran día! Felices 24 de junio. 🎉";
      }
      if (surpriseCountdownTimer) {
        surpriseCountdownTimer.textContent = "Cuenta regresiva: ¡el momento ha llegado!";
      }
      showUnlockButton();
      unlockSurpriseButton();
      hideCountdownModal();
    }
  }, 1000);

  if (Date.now() >= birthdayDate.getTime()) {
    showUnlockButton();
    unlockSurpriseButton();
    hideCountdownModal();
  }
}

closeCountdownButton?.addEventListener("click", hideCountdownModal);
closeCountdownAction?.addEventListener("click", hideCountdownModal);
closeCountdownOverlay?.addEventListener("click", hideCountdownModal);

surpriseButton?.addEventListener("click", (event) => {
  if (surpriseButton.getAttribute("aria-disabled") === "true") {
    event.preventDefault();
    if (surpriseMessage) {
      surpriseMessage.textContent = "La sorpresa se desbloqueará cuando termine la cuenta regresiva.";
    }
  } else {
    if (surpriseMessage) {
      surpriseMessage.textContent = "¡Ya puedes entrar a la sorpresa!";
    }
  }
});

if (audioButtons.length && introAudio) {
  audioButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (introAudio.paused) {
        introAudio.play().catch(() => {});
        audioButtons.forEach((btn) => (btn.textContent = "Pausar canción"));
      } else {
        introAudio.pause();
        audioButtons.forEach((btn) => (btn.textContent = "Escuchar canción"));
      }
    });
  });

  introAudio.addEventListener("ended", () => {
    audioButtons.forEach((btn) => (btn.textContent = "Escuchar canción"));
  });
}

if (navToggle && siteHeader) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  mainNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteHeader.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  let lastScrollY = window.pageYOffset;
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScrollY + 8 && currentScroll > 80) {
      siteHeader.classList.add("site-header--hidden");
    } else {
      siteHeader.classList.remove("site-header--hidden");
    }
    lastScrollY = currentScroll;
  });
}

renderMissions(missionsList);
renderYoutubeResults(youtubeResults, youtubeStatus);
renderMemories(memoriesList, {
  limit: Number(memoriesList?.dataset.memoryLimit) || undefined
});



