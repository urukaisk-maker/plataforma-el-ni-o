/**
 * UI del Tutor IA — Modal de chat con personaje.
 */

import {
  askTutor,
  speakTutorResponse,
  getTutorHistory,
  getPersonalities,
} from '../services/tutor-ai-service.js';
import { playClickSound } from '../utils/audio-feedback.js';

let currentPersonality = 'drako';

export function renderTutorModal(container) {
  if (!container) return;

  const history = getTutorHistory();
  const personalities = getPersonalities();

  container.innerHTML = `
    <div class="tutor-modal" id="tutorModal" role="dialog" aria-modal="true" aria-label="Tutor IA">
      <div class="tutor-modal__header">
        <div class="tutor-modal__avatar">${personalities[currentPersonality].emoji}</div>
        <div>
          <strong class="tutor-modal__name">${personalities[currentPersonality].name}</strong>
          <span class="tutor-modal__status">● En línea</span>
        </div>
        <button class="tutor-modal__close" id="closeTutorModal" aria-label="Cerrar tutor">✕</button>
      </div>
      <div class="tutor-modal__chat" id="tutorChatArea">
        ${history.length === 0 ? renderWelcomeMessage(personalities[currentPersonality]) : history.map(m => renderMessage(m)).join('')}
      </div>
      <div class="tutor-modal__input-area">
        <input type="text" class="tutor-modal__input" id="tutorInput" placeholder="Escribe tu pregunta..." autocomplete="off" />
        <button class="tutor-modal__send" id="tutorSendBtn" aria-label="Enviar">➤</button>
        <button class="tutor-modal__voice" id="tutorVoiceBtn" aria-label="Hablar">🎤</button>
      </div>
      <div class="tutor-modal__personalities">
        ${Object.entries(personalities).map(([id, p]) => `
          <button class="tutor-modal__personality-btn ${id === currentPersonality ? 'active' : ''}" data-personality="${id}" title="${p.name}">
            ${p.emoji}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  bindTutorEvents(container);
}

function renderWelcomeMessage(personality) {
  return `
    <div class="tutor-message tutor-message--assistant">
      <div class="tutor-message__avatar">${personality.emoji}</div>
      <div class="tutor-message__bubble">
        <p>¡Hola! Soy <strong>${personality.name}</strong>, tu tutor personal. Puedo ayudarte con matemáticas, historia, ciencia o simplemente darte ánimos. ¿En qué te ayudo hoy?</p>
      </div>
    </div>
  `;
}

function renderMessage(msg) {
  const isAssistant = msg.role === 'assistant';
  const emoji = isAssistant ? getPersonalities()[currentPersonality]?.emoji || '🤖' : '👤';
  return `
    <div class="tutor-message tutor-message--${msg.role}">
      ${isAssistant ? `<div class="tutor-message__avatar">${emoji}</div>` : ''}
      <div class="tutor-message__bubble">
        <p>${escapeHtml(msg.content)}</p>
      </div>
    </div>
  `;
}

function bindTutorEvents(container) {
  const chatArea = container.querySelector('#tutorChatArea');
  const input = container.querySelector('#tutorInput');
  const sendBtn = container.querySelector('#tutorSendBtn');
  const voiceBtn = container.querySelector('#tutorVoiceBtn');
  const closeBtn = container.querySelector('#closeTutorModal');

  sendBtn?.addEventListener('click', () => sendMessage());
  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage();
  });

  voiceBtn?.addEventListener('click', () => {
    playClickSound();
    // Stub para reconocimiento de voz (SpeechRecognition API)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.onresult = e => {
        input.value = e.results[0][0].transcript;
        sendMessage();
      };
      recognition.start();
    } else {
      alert('El reconocimiento de voz no está disponible en este navegador.');
    }
  });

  closeBtn?.addEventListener('click', () => {
    container.querySelector('#tutorModal').style.display = 'none';
  });

  container.querySelectorAll('.tutor-modal__personality-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPersonality = btn.dataset.personality;
      container.querySelectorAll('.tutor-modal__personality-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Actualizar avatar en header
      const p = getPersonalities()[currentPersonality];
      container.querySelector('.tutor-modal__avatar').textContent = p.emoji;
      container.querySelector('.tutor-modal__name').textContent = p.name;
    });
  });

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    playClickSound();
    input.value = '';

    // Añadir mensaje del usuario
    chatArea.insertAdjacentHTML('beforeend', renderMessage({ role: 'user', content: text }));
    chatArea.scrollTop = chatArea.scrollHeight;

    // Mostrar indicador de "escribiendo..."
    const typingId = 'typing-indicator';
    chatArea.insertAdjacentHTML('beforeend', `
      <div class="tutor-message tutor-message--assistant" id="${typingId}">
        <div class="tutor-message__avatar">${getPersonalities()[currentPersonality]?.emoji}</div>
        <div class="tutor-message__bubble"><p class="tutor-typing">Escribiendo<span>.</span><span>.</span><span>.</span></p></div>
      </div>
    `);
    chatArea.scrollTop = chatArea.scrollHeight;

    // Obtener respuesta
    const response = await askTutor(text, currentPersonality);

    // Eliminar indicador y mostrar respuesta
    document.getElementById(typingId)?.remove();
    chatArea.insertAdjacentHTML('beforeend', renderMessage({ role: 'assistant', content: response.text }));
    chatArea.scrollTop = chatArea.scrollHeight;

    // Leer en voz alta automáticamente
    speakTutorResponse(response.text);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
