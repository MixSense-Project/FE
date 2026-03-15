import React, { useState } from "react";
import add_btn from "../../assets/img/AIDJ/gray_add_btn.svg";
import { useMusic } from "../../context/MusicContext";
import Popup from "../../page/Music/Popup";

const Musiclist = ({
  track,
  trackId,
  title,
  artist,
  thumbnail,
  onPlay,
}) => {
  const { currentTrack, isPlay, setIsPlay, player } = useMusic();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState(null);

  const currentId =
    currentTrack?.track_id ||
    currentTrack?.id ||
    currentTrack?.track?.track_id ||
    currentTrack?.track?.id;

  const isCurrentTrack = String(currentId) === String(trackId);

  const handleTrackClick = (e) => {
    e.stopPropagation();

    // 현재 곡이 재생 중이면 -> 멈춤
    if (isCurrentTrack && isPlay) {
      if (player?.pauseVideo) {
        player.pauseVideo();
      }
      setIsPlay(false);
      return;
    }

    // 현재 곡이 멈춘 상태면 -> 다시 재생
    if (isCurrentTrack && !isPlay) {
      if (player?.playVideo) {
        player.playVideo();
      }
      setIsPlay(true);
      return;
    }

    // 다른 곡이면 -> 새로 재생
    onPlay?.();
  };

  const handleOpenPopup = (e) => {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();

    setPopupPosition({
      x: rect.left,
      y: rect.top + window.scrollY,
    });

    setIsPopupOpen(true);
  };

  return (
    <>
      <div className="aisearch_Musiclist_Wrap">
        <div
          className="musiclist_container"
          onClick={handleTrackClick}
          style={{ cursor: "pointer" }}
        >
          <div className="album_cover">
            {thumbnail && <img src={thumbnail} alt={title || "cover"} />}
          </div>

          <div className="music_info">
            <div className="title">{title}</div>
            <div className="artist">{artist}</div>
          </div>
        </div>

        <img
          className="plus_btn"
          src={add_btn}
          alt="add"
          onClick={handleOpenPopup}
          style={{
            width: "22px",
            height: "22px",
            objectFit: "contain",
            display: "block",
            flexShrink: 0,
            cursor: "pointer",
          }}
        />
      </div>

      {isPopupOpen && (
        <Popup
          onClose={() => setIsPopupOpen(false)}
          specificTrack={track}
          position={popupPosition}
        />
      )}
    </>
  );
};

export default Musiclist;