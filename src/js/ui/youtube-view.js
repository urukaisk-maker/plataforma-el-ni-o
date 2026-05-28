import { youtubePlaylists } from "../data/youtube-playlist.js";
import { searchVideos } from "../services/youtube-service.js";

const storageKey = "el-nino-video-state";
const youtubeApiCacheKey = "el-nino-youtube-api-cache";

function getVideoState() {
  return JSON.parse(localStorage.getItem(storageKey) ?? "{}");
}

function setVideoState(videoId, data) {
  const state = getVideoState();
  state[videoId] = { ...state[videoId], ...data };
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function getYoutubeApiCache() {
  return JSON.parse(localStorage.getItem(youtubeApiCacheKey) ?? "null");
}

function setYoutubeApiCache(data) {
  localStorage.setItem(youtubeApiCacheKey, JSON.stringify(data));
}

function isFileProtocol() {
  return typeof window !== "undefined" && window.location.protocol === "file:";
}

function getTags(playlistTitle) {
  const title = playlistTitle.toLowerCase();

  if (title.includes("terror") || title.includes("indies")) {
    return ["#terror", "#indie", "#fnaf"];
  }

  if (title.includes("guías")) {
    return ["#guía", "#gameplay", "#minecraft"];
  }

  if (title.includes("vistos")) {
    return ["#minecraft", "#gta", "#gameplay"];
  }

  if (title.includes("análisis")) {
    return ["#lore", "#curiosidades", "#guía"];
  }

  return ["#gameplay", "#gamer", "#español"];
}

function getDurationType(minutes) {
  if (minutes < 10) {
    return "short";
  }

  if (minutes <= 30) {
    return "medium";
  }

  return "long";
}

function formatDuration(minutes) {
  return `${minutes} min`;
}

function formatViews(views) {
  return `${(views / 1000000).toFixed(1)} M views`;
}

function formatDate(date) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.max(1, Math.floor(diff / 86400000));

  if (days < 30) {
    return `hace ${days} días`;
  }

  if (days < 365) {
    return `hace ${Math.floor(days / 30)} meses`;
  }

  return `hace ${Math.floor(days / 365)} años`;
}

function normalizeText(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function enrichPlaylists(playlists) {
  return playlists.map((playlist, playlistIndex) => {
    const tags = getTags(playlist.title);
    const videos = playlist.videos.map((video, videoIndex) => {
      const durationMinutes = 6 + ((playlistIndex + videoIndex) % 9) * 5;
      const views = 850000 + (playlistIndex + 1) * 420000 + videoIndex * 175000;
      const likes = Math.floor(views * 0.048);

      return {
        ...video,
        tags,
        durationMinutes,
        durationType: getDurationType(durationMinutes),
        views,
        likes,
        ratio: "96%",
        language: "Español",
        publishedAt: new Date(2026, Math.max(0, 5 - playlistIndex), Math.max(1, 24 - videoIndex * 2)).toISOString()
      };
    });

    return { ...playlist, videos, tags };
  });
}

function mapApiVideos(items) {
  return items.map((item, index) => {
    const videoId = item.id?.videoId;
    const snippet = item.snippet ?? {};
    const durationMinutes = 10 + index * 3;

    return {
      id: videoId,
      title: snippet.title ?? `Video de YouTube ${index + 1}`,
      channel: snippet.channelTitle ?? "YouTube",
      url: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: snippet.thumbnails?.high?.url ?? snippet.thumbnails?.medium?.url ?? snippet.thumbnails?.default?.url ?? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      tags: ["#youtube", "#api", "#gamer"],
      durationMinutes,
      durationType: getDurationType(durationMinutes),
      views: 1000000 + index * 150000,
      likes: 45000 + index * 2500,
      ratio: "API",
      language: "Español",
      publishedAt: snippet.publishedAt ?? new Date().toISOString()
    };
  }).filter((video) => video.id);
}

async function getYoutubePlaylists() {
  const localPlaylists = enrichPlaylists(youtubePlaylists.filter((playlist) => playlist.videos.length));

  if (isFileProtocol()) {
    return {
      playlists: localPlaylists,
      source: "local"
    };
  }

  try {
    const apiVideos = await searchVideos();

    if (apiVideos.length) {
      setYoutubeApiCache(apiVideos);
    }

    return {
      playlists: localPlaylists,
      source: "local"
    };
  } catch (error) {
    return {
      playlists: localPlaylists,
      source: "local",
      error
    };
  }
}

function createTags(tags) {
  return tags.map((tag) => `<span class="video-tag">${tag}</span>`).join("");
}

function createVideoCard(playlist, index) {
  const mainVideo = playlist.videos[0];
  const totalVideos = playlist.videos.length;
  const totalMinutes = playlist.videos.reduce((total, video) => total + video.durationMinutes, 0);
  const averageViews = playlist.videos.reduce((total, video) => total + video.views, 0) / totalVideos;

  return `
    <article class="video-card">
      <button class="video-card__button" type="button" data-playlist-index="${index}" aria-label="Abrir ${playlist.title}">
        <div class="video-card__thumb video-card__thumb--image" style="background-image: url('${mainVideo.thumbnail}')">
          <span class="youtube-preview__play">▶</span>
        </div>
        <div class="video-card__body">
          <h3>${playlist.title}</h3>
          <p>${playlist.description}</p>
          <div class="video-tags">${createTags(playlist.tags)}</div>
          <small>${totalVideos} videos · ${formatDuration(totalMinutes)} estimados · ${formatViews(averageViews)} de media</small>
        </div>
      </button>
    </article>
  `;
}

function createPlaylistItem(video, index, currentIndex) {
  const state = getVideoState()[video.id] ?? {};
  const activeClass = index === currentIndex ? " video-playlist__item--active" : "";
  const seenText = state.seen ? " · Visto" : "";
  const ratingText = state.rating ? ` · ${state.rating}/5` : "";

  return `
    <button class="video-playlist__item${activeClass}" type="button" data-video-index="${index}">
      <span class="video-playlist__thumb" style="background-image: url('${video.thumbnail}')"></span>
      <span>
        <strong>${video.title}</strong>
        <small>${video.channel} · ${formatDuration(video.durationMinutes)}${seenText}${ratingText}</small>
        <small>${video.tags.join(" ")}</small>
      </span>
    </button>
  `;
}

function setupVideoPlayer(container, playlists) {
  const modal = document.querySelector("#videoModal");
  const frame = document.querySelector("#videoFrame");
  const title = document.querySelector("#videoModalTitle");
  const channel = document.querySelector("#videoModalChannel");
  const playlist = document.querySelector("#videoPlaylist");
  const counter = document.querySelector("#videoCounter");
  const previousButton = document.querySelector("#videoPrev");
  const nextButton = document.querySelector("#videoNext");
  const similarButton = document.querySelector("#videoSimilar");
  const closeButtons = document.querySelectorAll("[data-video-close]");
  const meta = document.querySelector("#videoMeta");
  const seen = document.querySelector("#videoSeen");
  const rating = document.querySelector("#videoRating");
  const comment = document.querySelector("#videoComment");
  let activeVideos = [];
  let currentIndex = 0;

  if (!modal || !frame || !title || !channel || !playlist || !previousButton || !nextButton || !similarButton || !meta || !seen || !rating || !comment) {
    return;
  }

  function renderPlaylist() {
    playlist.innerHTML = activeVideos.map((video, index) => createPlaylistItem(video, index, currentIndex)).join("");
    if (counter) {
      counter.textContent = `Video ${currentIndex + 1} de ${activeVideos.length}`;
    }
  }

  function renderDetails(video) {
    const state = getVideoState()[video.id] ?? {};
    meta.innerHTML = `
      <span>${formatDuration(video.durationMinutes)}</span>
      <span>${formatViews(video.views)}</span>
      <span>${video.likes.toLocaleString("es-ES")} likes</span>
      <span>Ratio ${video.ratio}</span>
      <span>${formatDate(video.publishedAt)}</span>
      <span>${video.language}</span>
    `;
    seen.checked = Boolean(state.seen);
    rating.value = state.rating ?? "";
    comment.value = state.comment ?? "";
  }

  function playVideo(index) {
    currentIndex = (index + activeVideos.length) % activeVideos.length;
    const video = activeVideos[currentIndex];

    title.textContent = video.title;
    channel.textContent = `${video.channel} · ${video.tags.join(" ")}`;
    frame.src = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`;
    renderPlaylist();
    renderDetails(video);
  }

  function openPlayer(index) {
    const selectedPlaylist = playlists[index];
    activeVideos = selectedPlaylist.videos;
    playVideo(0);
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-video-modal-open");
  }

  function closePlayer() {
    modal.setAttribute("aria-hidden", "true");
    frame.removeAttribute("src");
    document.body.classList.remove("is-video-modal-open");
  }

  container.onclick = (event) => {
    const button = event.target.closest(".video-card__button");

    if (!button) {
      return;
    }

    openPlayer(Number(button.dataset.playlistIndex));
  };

  playlist.onclick = (event) => {
    const button = event.target.closest(".video-playlist__item");

    if (!button) {
      return;
    }

    playVideo(Number(button.dataset.videoIndex));
  };

  seen.onchange = () => {
    setVideoState(activeVideos[currentIndex].id, { seen: seen.checked });
    renderPlaylist();
  };

  rating.onchange = () => {
    setVideoState(activeVideos[currentIndex].id, { rating: rating.value });
    renderPlaylist();
  };

  comment.oninput = () => {
    setVideoState(activeVideos[currentIndex].id, { comment: comment.value });
  };

  previousButton.onclick = () => playVideo(currentIndex - 1);
  nextButton.onclick = () => playVideo(currentIndex + 1);
  similarButton.onclick = () => playVideo(currentIndex + 1);

  closeButtons.forEach((button) => {
    button.onclick = closePlayer;
  });

  document.onkeydown = (event) => {
    if (event.key === "Escape") {
      closePlayer();
    }

    if (modal.getAttribute("aria-hidden") === "false" && event.key === "ArrowLeft") {
      playVideo(currentIndex - 1);
    }

    if (modal.getAttribute("aria-hidden") === "false" && event.key === "ArrowRight") {
      playVideo(currentIndex + 1);
    }
  };
}

function filterPlaylists(playlists, search, duration) {
  const normalizedSearch = normalizeText(search.trim());

  return playlists.map((playlist) => {
    const videos = playlist.videos.filter((video) => {
      const searchableText = normalizeText(`${playlist.title} ${playlist.description} ${video.title} ${video.channel} ${video.tags.join(" ")}`);
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesDuration = duration === "all" || video.durationType === duration;

      return matchesSearch && matchesDuration;
    });

    return { ...playlist, videos };
  }).filter((playlist) => playlist.videos.length);
}

function sortPlaylists(playlists, sort) {
  return playlists.map((playlist) => {
    const videos = [...playlist.videos].sort((a, b) => {
      if (sort === "views") {
        return b.views - a.views;
      }

      if (sort === "longest") {
        return b.durationMinutes - a.durationMinutes;
      }

      if (sort === "oldest") {
        return new Date(a.publishedAt) - new Date(b.publishedAt);
      }

      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });

    return { ...playlist, videos };
  });
}

export async function renderYoutubeResults(container, statusElement) {
  if (!container) {
    return;
  }

  try {
    if (statusElement) {
      statusElement.textContent = "Preparando lista de reproducción...";
    }

    const search = document.querySelector("#videoSearch");
    const duration = document.querySelector("#videoDurationFilter");
    const sort = document.querySelector("#videoSort");
    const youtubeData = await getYoutubePlaylists();
    const playlists = youtubeData.playlists;

    function render() {
      const filteredPlaylists = sortPlaylists(filterPlaylists(playlists, search?.value ?? "", duration?.value ?? "all"), sort?.value ?? "recent");

      if (!filteredPlaylists.length) {
        container.innerHTML = "";

        if (statusElement) {
          statusElement.textContent = "No se encontraron videos con esos filtros.";
        }

        return;
      }

      container.innerHTML = filteredPlaylists.map(createVideoCard).join("");
      setupVideoPlayer(container, filteredPlaylists);

      if (statusElement) {
        const totalVideos = filteredPlaylists.reduce((total, playlist) => total + playlist.videos.length, 0);
        const sourceMessage = "desde las listas guardadas";
        statusElement.textContent = `Se cargaron ${filteredPlaylists.length} listas y ${totalVideos} videos ${sourceMessage}.`;
      }
    }

    search?.addEventListener("input", render);
    duration?.addEventListener("change", render);
    sort?.addEventListener("change", render);
    render();
  } catch (error) {
    const fallbackPlaylists = enrichPlaylists(youtubePlaylists.filter((playlist) => playlist.videos.length));
    container.innerHTML = fallbackPlaylists.map(createVideoCard).join("");
    setupVideoPlayer(container, fallbackPlaylists);

    if (statusElement) {
      const totalVideos = fallbackPlaylists.reduce((total, playlist) => total + playlist.videos.length, 0);
      statusElement.textContent = `No se pudo completar la búsqueda externa; se cargaron ${fallbackPlaylists.length} listas guardadas y ${totalVideos} videos como respaldo.`;
    }
  }
}
