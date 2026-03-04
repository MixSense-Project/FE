import React, { useEffect } from "react";
import YouTube from "react-youtube";
import { useMusic } from "../context/MusicContext";

const YouTubePlayer = () => {
  const { currentTrack, setPlayer, setIsPlay, player, next } = useMusic();

  const videoId =
    currentTrack?.youtube_video_id ||
    currentTrack?.track?.youtube_video_id ||
    currentTrack?.video_id;

  useEffect(() => {
    if (player && typeof player.loadVideoById === "function" && videoId) {
      try {
        player.loadVideoById(videoId);
        player.playVideo();
        setIsPlay(true);
      } catch (error) {
        console.error("재생 중 오류 발생:", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  if (!videoId) return null;

  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
    },
  };

  return (
    <div style={{ display: "none" }}>
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={(e) => {
          setPlayer(e.target);
        }}
        onStateChange={(e) => {
          setIsPlay(e.data === 1);

          // 영상 끝나면 다음 곡으로
          if (e.data === 0) {
            next?.();
          }
        }}
        onError={(e) => console.error("YouTube Player Error:", e.data)}
      />
    </div>
  );
};

export default YouTubePlayer;