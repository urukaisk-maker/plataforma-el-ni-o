import { movies } from '../data/movies-data.js';

export function renderMovies(container) {
  if (!container) return;

  if (movies.length === 0) {
    container.innerHTML = `
      <article class="placeholder-card">
        <h3>Próximamente</h3>
        <p>No hay películas disponibles en este momento.</p>
      </article>
    `;
    return;
  }

  container.innerHTML = movies
    .map(
      movie => `
    <article class="movie-card" data-movie-id="${movie.id}">
      <button type="button" class="movie-card__link" aria-label="Ver ${movie.title}" onclick="window.openMovieModal('${movie.embed}', '${movie.title}')">
        <div class="movie-card__thumb">
          <img src="${movie.thumbnail}" alt="Miniatura de ${movie.title}" loading="lazy" width="480" height="360">
          <span class="movie-card__play">▶</span>
        </div>
        <div class="movie-card__info">
          <h3 class="movie-card__title">${movie.title}</h3>
          ${movie.description ? `<p class="movie-card__desc">${movie.description}</p>` : ''}
        </div>
      </button>
    </article>
  `
    )
    .join('');
}
