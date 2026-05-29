/**
 * UI de cuentos interactivos.
 */

import {
  getStories, getStory, getStoryProgress,
  makeChoice, answerQuiz, resetStory,
} from '../services/story-engine.js';
import { playClickSound } from '../utils/audio-feedback.js';

export function renderStoryLibrary(container) {
  const stories = getStories();
  if (!container) return;

  container.innerHTML = stories.map(s => {
    const progress = getStoryProgress(s.id);
    const completed = progress.completed;
    return `
      <div class="story-card" data-story-id="${s.id}">
        <div class="story-card__cover">${s.cover}</div>
        <div class="story-card__info">
          <h3>${escapeHtml(s.title)}</h3>
          <p>${escapeHtml(s.description)}</p>
          <span class="story-card__status">${completed ? '✅ Completado' : progress.currentPage !== 'p1' ? '📖 En progreso' : '🆕 Nuevo'}</span>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.story-card').forEach(card => {
    card.addEventListener('click', () => {
      playClickSound();
      openStoryReader(card.dataset.storyId);
    });
  });
}

function openStoryReader(storyId) {
  const story = getStory(storyId);
  const progress = getStoryProgress(storyId);
  const page = story.pages.find(p => p.id === progress.currentPage) || story.pages[0];

  const modal = document.createElement('div');
  modal.className = 'story-reader';
  modal.innerHTML = `
    <div class="story-reader__content">
      <button class="story-reader__close" aria-label="Cerrar">✕</button>
      <h2>${escapeHtml(story.title)} ${story.cover}</h2>
      <div class="story-reader__page" id="storyPageContent"></div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('.story-reader__close').addEventListener('click', () => modal.remove());

  renderStoryPage(storyId, page.id, modal.querySelector('#storyPageContent'), modal);
}

function renderStoryPage(storyId, pageId, container, modal) {
  const story = getStory(storyId);
  const page = story.pages.find(p => p.id === pageId);
  if (!page) return;

  let html = `<p class="story-text">${escapeHtml(page.text)}</p>`;

  if (page.quiz && !page.answered) {
    html += `
      <div class="story-quiz">
        <p class="story-quiz__question">${escapeHtml(page.quiz.question)}</p>
        <div class="story-quiz__options">
          ${page.quiz.options.map((opt, i) => `
            <button class="story-quiz__option" data-index="${i}">${escapeHtml(opt)}</button>
          `).join('')}
        </div>
        <div class="story-quiz__feedback" id="quizFeedback"></div>
      </div>
    `;
  }

  if (page.choices) {
    html += `<div class="story-choices">`;
    page.choices.forEach(choice => {
      html += `<button class="story-choice-btn" data-next="${choice.nextPage}">
        <span class="story-choice-emoji">${choice.emoji}</span>
        <span>${escapeHtml(choice.text)}</span>
      </button>`;
    });
    html += `</div>`;
  }

  if (page.ending) {
    const emoji = page.ending === 'good' ? '🎉' : page.ending === 'bad' ? '😓' : '🤝';
    html += `<div class="story-ending story-ending--${page.ending}">
      <div class="story-ending__emoji">${emoji}</div>
      <p>${page.ending === 'good' ? '¡Final feliz!' : page.ending === 'bad' ? 'No fue la mejor decision...' : 'Final neutral'}</p>
      ${page.xpReward ? `<p class="story-ending__xp">+${page.xpReward} XP</p>` : ''}
      <button class="button button--primary" id="restartStoryBtn">Reiniciar cuento</button>
    </div>`;
  }

  container.innerHTML = html;

  // Bind choices
  container.querySelectorAll('.story-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      const nextPage = makeChoice(storyId, { nextPage: btn.dataset.next });
      if (nextPage) {
        renderStoryPage(storyId, nextPage.id, container, modal);
      }
    });
  });

  // Bind quiz
  container.querySelectorAll('.story-quiz__option').forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      const idx = parseInt(btn.dataset.index, 10);
      const result = answerQuiz(storyId, page.id, idx);
      const feedback = container.querySelector('#quizFeedback');

      container.querySelectorAll('.story-quiz__option').forEach(b => b.disabled = true);
      btn.classList.add(result.correct ? 'correct' : 'incorrect');

      feedback.innerHTML = result.correct
        ? '✅ ¡Correcto! +10 XP'
        : `❌ Incorrecto. La respuesta correcta era: ${page.quiz.options[result.correctIndex]}`;
    });
  });

  // Bind restart
  container.querySelector('#restartStoryBtn')?.addEventListener('click', () => {
    playClickSound();
    resetStory(storyId);
    renderStoryPage(storyId, story.pages[0].id, container, modal);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
