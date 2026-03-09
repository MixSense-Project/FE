import { api } from "./client";
import { normalizeTrackData } from "../utils/track";

function authHeader() {
  const token = localStorage.getItem("access_token");
  return token ? `Bearer ${token}` : "";
}

async function readJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

export function pickPlaylistId(created) {
  if (!created) return null;
  if (typeof created === "string") return created;

  const direct = created.id ?? created.playlist_id ?? created.playlistId;
  if (direct) return direct;

  const p = created.playlist;
  if (p) return p.id ?? p.playlist_id ?? p.playlistId ?? null;

  const d = created.data;
  if (d) return d.id ?? d.playlist_id ?? d.playlistId ?? null;

  return null;
}

const BASE = "/api";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function createPlaylist({ title }) {
  const res = await fetch(`${BASE}/playlists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ title }),
  });

  const data = await readJson(res);
  if (!res.ok) throw new Error(data?.detail || `HTTP ${res.status}`);
  return data;
}

export async function fetchMyPlaylists() {
  const res = await fetch(`${BASE}/playlists`, {
    method: "GET",
    headers: {
      Authorization: authHeader(),
      "ngrok-skip-browser-warning": "true",
    },
  });

  const data = await readJson(res);
  if (!res.ok) throw new Error(data?.detail || `HTTP ${res.status}`);
  return data;
}

export async function getPlaylistCoverUploadUrl({
  playlistId,
  filename,
  contentType,
}) {
  const safeContentType = contentType || "application/octet-stream";

  const res = await fetch(`${BASE}/playlists/${playlistId}/cover/upload-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({
      filename,
      content_type: safeContentType,
      contentType: safeContentType,
      mime_type: safeContentType,
    }),
  });

  const data = await readJson(res);
  if (!res.ok) throw new Error(data?.detail || `HTTP ${res.status}`);
  return data;
}

export async function uploadFileToSignedUrl({ signedUrl, file }) {
  const res = await fetch(signedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Upload failed: HTTP ${res.status} ${t}`);
  }
  return true;
}

export async function setPlaylistCoverPath({ playlistId, coverPath }) {
  const res = await fetch(`${BASE}/playlists/${playlistId}/cover`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ cover_path: coverPath }),
  });

  const data = await readJson(res);
  if (!res.ok) throw new Error(data?.detail || `HTTP ${res.status}`);
  return data;
}

export async function deletePlaylist(playlistId) {
  const res = await fetch(`${BASE}/playlists/${playlistId}`, {
    method: "DELETE",
    headers: {
      Authorization: authHeader(),
      "ngrok-skip-browser-warning": "true",
    },
  });

  const data = await readJson(res);
  if (!res.ok) throw new Error(data?.detail || `HTTP ${res.status}`);
  return data;
}

export async function updatePlaylistTitle({ playlistId, title }) {
  const res = await fetch(`/api/playlists/${playlistId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ title }),
  });

  const data = await readJson(res);
  if (!res.ok) throw new Error(data?.detail || `HTTP ${res.status}`);
  return data;
}

export async function addTrackToPlaylist({ playlistId, track }) {
  const normalizedTrack = normalizeTrackData(track);

  const res = await fetch(`/api/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({
      track_id: String(normalizedTrack.track_id),
      title: normalizedTrack.title ?? null,
      artist: normalizedTrack.artist ?? null,
      track_image_url: normalizedTrack.track_image_url ?? null,
      youtube_video_id: normalizedTrack.youtube_video_id ?? null,
    }),
  });

  const text = await res.text().catch(() => "");
  console.log("[addTrackToPlaylist] status:", res.status);
  console.log("[addTrackToPlaylist] body:", text);

  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) throw new Error(data?.detail || text || `HTTP ${res.status}`);
  return data;
}

export async function fetchPlaylistTracks(playlistId) {
  if (!playlistId) throw new Error("playlistId is required");

  const res = await fetch(`/api/playlists/${playlistId}/tracks`, {
    method: "GET",
    headers: {
      Authorization: authHeader(),
      "ngrok-skip-browser-warning": "true",
    },
  });

  const data = await readJson(res);
  if (!res.ok) throw new Error(data?.detail || `HTTP ${res.status}`);
  return data;
}

export async function removeTrackFromPlaylist({ playlistId, trackId }) {
  if (!playlistId) throw new Error("playlistId is required");
  if (!trackId) throw new Error("trackId is required");

  const res = await fetch(`${BASE}/playlists/${playlistId}/tracks/${trackId}`, {
    method: "DELETE",
    headers: {
      Authorization: authHeader(),
      "ngrok-skip-browser-warning": "true",
    },
  });

  const data = await readJson(res);
  if (!res.ok) throw new Error(data?.detail || `HTTP ${res.status}`);
  return data;
}