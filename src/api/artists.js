import { api } from "./client";

function pickImage(a) {
  if (Array.isArray(a?.images) && a.images.length > 0) {
    const first = a.images[0];
    return typeof first === "string" ? first : first?.url;
  }

  return (
    a.imageUrl ??
    a.image_url ??
    a.image ??
    a.profileImageUrl ??
    a.profile_image_url ??
    a.thumbnail ??
    a.thumbnailUrl ??
    null
  );
}

export function normalizeArtists(payload) {
  const list = Array.isArray(payload)
    ? payload
    : payload?.artists ??
      payload?.items ??
      payload?.results ??
      payload?.data ??
      payload?.artists?.items ??
      [];

  return (Array.isArray(list) ? list : [])
    .map((a, idx) => {
      const rawId =
        a.id ??
        a.artistId ??
        a.artist_id ??
        a.spotifyId ??
        a.spotify_id ??
        a.artistID ??
        null;

      const name =
        a.name ?? a.artistName ?? a.artist_name ?? a.title ?? a.artist ?? "";

      const id = rawId ?? `${name || "artist"}__${idx}`;

      return {
        id,
        name,
        imageUrl: pickImage(a),
      };
    })
    .filter((a) => a.id != null);
}

export async function fetchArtists({
  genres,
  keyword,
  index_char,
  limit,
  token,
} = {}) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const params = {};

  if (Array.isArray(genres) && genres.length > 0) {
    params.genres = genres;
  }

  if (keyword) {
    params.keyword = keyword;
  }

  if (index_char) {
    params.index_char = index_char;
  }

  if (limit) {
    params.limit = limit;
  }

  const res = await api.get("/api/artists", {
    params,
    headers,
  });

  return normalizeArtists(res.data);
}