export function getYoutubeThumbnail(videoId) {
  if (!videoId) return null;
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function extractYoutubeVideoId(track) {
  return (
    track?.youtube_video_id ??
    track?.youtubeVideoId ??
    track?.youtube_id ??
    track?.youtubeId ??
    track?.video_id ??
    track?.videoId ??
    track?.track?.youtube_video_id ??
    track?.track?.youtubeVideoId ??
    track?.track?.youtube_id ??
    track?.track?.youtubeId ??
    track?.track?.video_id ??
    track?.track?.videoId ??
    null
  );
}

export function normalizeTrackImage(track) {
  const videoId = extractYoutubeVideoId(track);
  const youtubeThumb = getYoutubeThumbnail(videoId);

  const fallbackImage =
    track?.track_image_url ??
    track?.thumbnail_url ??
    track?.image_url ??
    track?.cover_url ??
    track?.coverUrl ??
    track?.album_image_url ??
    track?.album_cover_url ??
    track?.album?.image_url ??
    track?.album?.cover_url ??
    track?.track?.track_image_url ??
    track?.track?.thumbnail_url ??
    track?.track?.image_url ??
    track?.track?.cover_url ??
    null;

  return youtubeThumb ?? fallbackImage ?? null;
}

export function normalizeTrackData(track) {
  const videoId = extractYoutubeVideoId(track);

  const title =
    track?.title ??
    track?.track_title ??
    track?.track_name ??
    track?.name ??
    track?.song_title ??
    track?.song_name ??
    track?.track?.title ??
    track?.track?.name ??
    null;

  const artist =
    track?.artist ??
    track?.artist_name ??
    track?.artists_name ??
    track?.singer ??
    track?.artist?.name ??
    (Array.isArray(track?.artists)
      ? track.artists.map((a) => a?.name).filter(Boolean).join(", ")
      : null) ??
    track?.track?.artist ??
    track?.track?.artist_name ??
    null;

  const trackId =
    track?.track_id ??
    track?.id ??
    track?.trackId ??
    track?.spotify_track_id ??
    track?.spotifyId ??
    track?.track?.track_id ??
    track?.track?.id ??
    null;

  return {
    ...track,
    track_id: trackId,
    title,
    artist,
    youtube_video_id: videoId,
    track_image_url: normalizeTrackImage(track),
  };
}