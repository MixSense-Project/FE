import React, { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMusic } from "../../context/MusicContext";
import music_play from "../../assets/img/home/music_play.svg";
import music_stop from "../../assets/img/home/music_stop.svg";
import music_fast from "../../assets/img/home/music_fast.svg";

const Musicplay = () => {
  const {
    currentTrack,
    isPlay,
    setIsPlay,
    player,
    next,
  } = useMusic();

  const navigate = useNavigate();
  const audioRef = useRef(null);

  const item = currentTrack?.track || currentTrack;

  const videoId =
    currentTrack?.youtube_video_id ||
    currentTrack?.track?.youtube_video_id ||
    currentTrack?.video_id ||
    currentTrack?.track?.video_id ||
    null;

  const mixAudioUrl =
    currentTrack?.mix_audio_url ||
    currentTrack?.audio_url ||
    currentTrack?.mix?.mix_audio_url ||
    currentTrack?.track?.mix_audio_url ||
    null;

  const isAiMix =
    currentTrack?.item_type === "mix" || (!!mixAudioUrl && !videoId);

  const title =
    currentTrack?.title ||
    currentTrack?.track?.title ||
    currentTrack?.mix?.title ||
    item?.title ||
    item?.track_name ||
    "Unknown Title";

  const artist =
    currentTrack?.artist ||
    currentTrack?.track?.artist ||
    currentTrack?.mix?.artist ||
    item?.artist ||
    item?.artist_name ||
    "Unknown Artist";

  const coverImage = useMemo(() => {
    if (isAiMix) {
      return (
        currentTrack?.track_image_url ||
        currentTrack?.cover_url ||
        currentTrack?.image_url ||
        currentTrack?.mix?.track_image_url ||
        currentTrack?.mix?.cover_url ||
        currentTrack?.mix?.image_url ||
        ""
      );
    }

    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }

    return "";
  }, [isAiMix, currentTrack, videoId]);

  useEffect(() => {
    if (!isAiMix || !audioRef.current) return;

    const audio = audioRef.current;

    if (isPlay) {
      audio.play().catch((err) => {
        console.error("AI Mix 재생 실패:", err);
      });
    } else {
      audio.pause();
    }
  }, [isAiMix, isPlay, mixAudioUrl]);

  useEffect(() => {
    if (!isAiMix || !audioRef.current) return;

    const audio = audioRef.current;
    audio.currentTime = 0;

    if (isPlay) {
      audio.play().catch((err) => {
        console.error("AI Mix 자동 재생 실패:", err);
      });
    }
  }, [currentTrack, isAiMix, isPlay]);

  if (!videoId && !mixAudioUrl) return null;

  const togglePlay = (e) => {
    e.stopPropagation();

    if (isAiMix) {
      if (!audioRef.current) return;

      if (isPlay) {
        audioRef.current.pause();
        setIsPlay(false);
      } else {
        audioRef.current.play().catch((err) => {
          console.error("AI Mix 재생 실패:", err);
        });
        setIsPlay(true);
      }
      return;
    }

    if (!player) return;

    if (isPlay) {
      player.pauseVideo?.();
      setIsPlay(false);
    } else {
      player.playVideo?.();
      setIsPlay(true);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    next();
  };

  return (
    <div id="Musicplay_Wrap" onClick={() => navigate("/music/songplay")}>
      <div className="musicplay_wrap">
        <div className="musiclist_container">
          <div
            className="album_cover"
            style={{ overflow: "hidden", borderRadius: "8px" }}
          >
            {coverImage ? (
              <img
                src={coverImage}
                alt="cover"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : null}
          </div>

          <div className="music_info">
            <div className="title">{title}</div>
            <div className="artist">{artist}</div>
          </div>
        </div>

        <div className="btn_container">
          <button className="play_btn" onClick={togglePlay}>
            <img src={isPlay ? music_play : music_stop} alt="play_stop" />
          </button>

          <button className="fast_btn" onClick={handleNext}>
            <img src={music_fast} alt="fast" />
          </button>
        </div>

        {isAiMix && mixAudioUrl ? (
          <audio
            ref={audioRef}
            src={mixAudioUrl}
            preload="auto"
            onEnded={() => {
              next();
            }}
            style={{ display: "none" }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Musicplay;