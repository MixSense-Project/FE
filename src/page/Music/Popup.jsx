import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useMusic } from "../../context/MusicContext";
import aidj_img from "../../assets/img/Music/aidj.svg";
import share__img from "../../assets/img/Music/share.svg";
import add_img from "../../assets/img/Music/add.svg";

const Popup = ({ onClose, specificTrack, position }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentTrack } = useMusic();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/playlists`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        });

        const playlistData = response.data.playlists || response.data || [];
        console.log("불러온 playlists:", playlistData);
        setPlaylists(Array.isArray(playlistData) ? playlistData : []);
      } catch (error) {
        console.error("플레이리스트 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [BASE_URL, token]);

  const handleAddToPlaylist = async (playlistId) => {
    const target = specificTrack || currentTrack;
    const finalTrackId =
      target?.track?.track_id ||
      target?.track_id ||
      target?.id;

    console.log("선택된 playlistId:", playlistId);
    console.log("추가할 finalTrackId:", finalTrackId);
    console.log("specificTrack/currentTrack:", target);

    if (!playlistId) {
      alert("플레이리스트 정보가 없습니다.");
      return;
    }

    if (!finalTrackId) {
      alert("추가할 곡 정보가 없습니다.");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/playlists/${playlistId}/tracks`,
        { track_id: finalTrackId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            "Content-Type": "application/json",
          },
        }
      );

      alert("곡이 추가되었습니다!");
      onClose();
    } catch (error) {
      console.error("플리 추가 실패:", error?.response?.data || error);
      alert(error?.response?.data?.message || "추가 실패");
    }
  };

  const handleShare = () => {
    const target = specificTrack || currentTrack;
    const videoId =
      target?.track?.youtube_video_id ||
      target?.youtube_video_id ||
      target?.video_id;

    if (videoId) {
      navigator.clipboard
        .writeText(`https://www.youtube.com/watch?v=${videoId}`)
        .then(() => {
          alert("링크 복사 완료!");
          onClose();
        });
    } else {
      alert("공유할 링크가 없습니다.");
    }
  };

  let popupWrapStyle = {
    position: "absolute",
    zIndex: 10001,
  };

  if (position) {
    popupWrapStyle = {
      ...popupWrapStyle,
      top: `${position.y - 150}px`,
      left: "50%",
      transform: "translateX(-15%)",
      width: "187px",
    };
  }

  return (
    <div
      className="Popup_Overlay"
      onClick={onClose}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 10000,
        borderRadius: "inherit",
      }}
    >
      <div
        id="Popup_Wrap"
        onClick={(e) => e.stopPropagation()}
        style={popupWrapStyle}
      >
        <Link to="/ai_dj">
          <button className="aidj list">
            <p>Go to AI DJ</p>
            <img src={aidj_img} alt="ai dj" />
          </button>
        </Link>

        <button className="share list" onClick={handleShare}>
          <p>Share</p>
          <img src={share__img} alt="share" />
        </button>

        <div
          className="playlist_container"
          style={{ maxHeight: "200px", overflowY: "auto" }}
        >
          {loading ? (
            <p style={{ color: "#fff", textAlign: "center", padding: "10px" }}>
              Loading...
            </p>
          ) : playlists.length > 0 ? (
            playlists.map((playlist) => {
              const pid = playlist?.playlist_id || playlist?.id;

              return (
                <button
                  key={pid}
                  className="add list"
                  onClick={() => handleAddToPlaylist(pid)}
                >
                  <p>{`Add to ${playlist?.title || "Playlist"}`}</p>
                  <img src={add_img} alt="add" />
                </button>
              );
            })
          ) : (
            <div className="add list">
              <p>No Playlists found</p>
              <img src={add_img} alt="none" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;