import { appConfig } from "../config/app-config.js";

const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

export async function getPlaylistVideos(playlistId = appConfig.youtube.defaultPlaylistId) {
  if (!appConfig.youtube.apiKey || !playlistId) {
    return [];
  }

  const url = new URL(`${YOUTUBE_API_BASE_URL}/playlistItems`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("playlistId", playlistId);
  url.searchParams.set("maxResults", String(appConfig.youtube.maxResults));
  url.searchParams.set("key", appConfig.youtube.apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("No se pudieron cargar los videos de YouTube.");
  }

  const data = await response.json();
  return data.items ?? [];
}

export async function searchVideos(query = appConfig.youtube.defaultSearchQuery) {
  if (!appConfig.youtube.apiKey || !query) {
    return [];
  }

  const url = new URL(`${YOUTUBE_API_BASE_URL}/search`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("q", query);
  url.searchParams.set("maxResults", String(appConfig.youtube.maxResults));
  url.searchParams.set("safeSearch", "strict");
  url.searchParams.set("key", appConfig.youtube.apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("No se pudieron cargar los resultados de YouTube.");
  }

  const data = await response.json();
  return data.items ?? [];
}
