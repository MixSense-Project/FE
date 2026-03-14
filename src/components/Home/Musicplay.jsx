import React, { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMusic } from "../../context/MusicContext";
import music_play from "../../assets/img/home/music_play.svg";
import music_stop from "../../assets/img/home/music_stop.svg";
import music_fast from "../../assets/img/home/music_fast.svg";

const Musicplay = () => {
  const { currentTrack, isPlay, setIsPlay, player, next } = useMusic();
  const navigate = useNavigate();
  const audioRef = useRef(null);

  // 데이터 추출
  const item = currentTrack?.track || currentTrack;
  const videoId = item?.youtube_video_id || item?.video_id || null;
  const mixAudioUrl = currentTrack?.mix_audio_url || currentTrack?.audio_url || item?.mix_audio_url || null;
  const isAiMix = (!!mixAudioUrl && !videoId);

  const title = item?.title || item?.track_name || "Unknown Title";
  const artist = item?.artist || item?.artist_name || "Unknown Artist";

  const coverImage = useMemo(() => {
    if (isAiMix) return currentTrack?.track_image_url || currentTrack?.cover_url || "";
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : "";
  }, [isAiMix, currentTrack, videoId]);

  // 재생/정지 제어
  useEffect(() => {
    if (!isAiMix || !audioRef.current) return;
    isPlay ? audioRef.current.play().catch(() => {}) : audioRef.current.pause();
  }, [isPlay, isAiMix]);

  useEffect(() => {
    if (isAiMix && audioRef.current) {
      audioRef.current.currentTime = 0;
      if (isPlay) audioRef.current.play().catch(() => {});
    }
  }, [currentTrack, isAiMix]);

  if (!videoId && !mixAudioUrl) return null;

  const togglePlay = (e) => {
    e.stopPropagation();
    if (isAiMix) {
      if (isPlay) { audioRef.current.pause(); setIsPlay(false); }
      else { audioRef.current.play().catch(() => {}); setIsPlay(true); }
    } else if (player) {
      isPlay ? player.pauseVideo?.() : player.playVideo?.();
      setIsPlay(!isPlay);
    }
  };

  return (
    <div id="Musicplay_Wrap" onClick={() => navigate("/music/songplay")}>
      <div className="musicplay_wrap">
        <div className="musiclist_container">
          <div className="album_cover">{coverImage && <img src={coverImage} alt="cover" />}</div>
          <div className="music_info">
            <div className="title">{title}</div>
            <div className="artist">{artist}</div>
          </div>
        </div>

        <div className="btn_container">
          <button className="play_btn" onClick={togglePlay}>
            <img src={isPlay ? music_play : music_stop} alt="play_toggle" />
          </button>
          <button className="fast_btn" onClick={(e) => { e.stopPropagation(); next(); }}>
            <img src={music_fast} alt="next" />
          </button>
        </div>

        {isAiMix && (
          <audio 
            ref={audioRef} 
            src={mixAudioUrl} 
            onEnded={() => { console.log("[Player] 재생 끝 -> 다음 곡 요청"); next(); }} 
            style={{ display: "none" }} 
          />
        )}
      </div>
    </div>
  );
};

export default Musicplay;