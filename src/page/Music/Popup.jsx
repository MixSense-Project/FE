import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useMusic } from '../../context/MusicContext';
import aidj_img from '../../assets/img/Music/aidj.svg';
import share__img from '../../assets/img/Music/share.svg';
import add_img from '../../assets/img/Music/add.svg';

const Popup = ({ onClose, specificTrack }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentTrack } = useMusic();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('access_token');

  // 1. 플레이리스트 목록 불러오기
  const fetchPlaylists = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await axios.get(`${BASE_URL}/api/playlists`, {
        headers: { 
          "ngrok-skip-browser-warning": "69420", 
          "Authorization": `Bearer ${token}` 
        }
      });
      setPlaylists(response.data.playlists || response.data);
    } catch (error) {
      console.error("플레이리스트 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  // 2. 플레이리스트에 곡 추가하는 함수
  const handleAddToPlaylist = async (playlistId) => {
    // [수정 포인트] specificTrack(Home 리스트 클릭)이 있으면 우선 사용하고, 없으면 currentTrack(재생중인 곡) 사용
    const target = specificTrack || currentTrack;
    
    // 데이터 구조 대응: track.track_id (송플레이) OR track_id OR id (Home 리스트)
    const finalTrackId = target?.track?.track_id || target?.track_id || target?.id;

    if (!finalTrackId) {
      alert("추가할 곡 정보가 없습니다.");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/playlists/${playlistId}/tracks`, 
        { track_id: finalTrackId }, 
        {
          headers: { "Authorization": `Bearer ${token}` }
        }
      );

      alert("플레이리스트에 곡이 추가되었습니다!");
      onClose(); 
    } catch (error) {
      console.error("곡 추가 실패:", error);
      alert(error.response?.data?.message || "곡을 추가하는 데 실패했습니다.");
    }
  };

  const handleShare = () => {
    const target = specificTrack || currentTrack;
    const videoId = target?.track?.youtube_video_id || target?.youtube_video_id || target?.video_id;

    if (videoId) {
      const youtubeLink = `https://www.youtube.com/watch?v=${videoId}`;
      navigator.clipboard.writeText(youtubeLink)
        .then(() => {
          alert("유튜브 링크가 복사되었습니다!");
          onClose();
        })
        .catch(() => alert("링크 복사에 실패했습니다."));
    } else {
      alert("유튜브 정보를 찾을 수 없습니다.");
    }
  };

  return (
    <div className="Popup_Overlay" onClick={onClose}> 
        <div id="Popup_Wrap" onClick={(e) => e.stopPropagation()}>
            <Link to='/ai_dj'>
              <button className="aidj list">
                  <p>Go to AI DJ</p>
                  <img src={aidj_img} alt="ai dj" />
              </button>
            </Link>

            <button className="share list" onClick={handleShare}>
                <p>Share</p>
                <img src={share__img} alt="share" />
            </button>

            <div className="playlist_container">
                {loading ? (
                    <p style={{ color: '#fff', textAlign: 'center', padding: '10px' }}>Loading...</p>
                ) : playlists.length > 0 ? (
                    playlists.map((playlist) => (
                        <button 
                          key={playlist.id} 
                          className="add list" 
                          onClick={() => handleAddToPlaylist(playlist.id)}
                        >
                          <p>{`Add to ${playlist.title || playlist.name || "Untitled Playlist"}`}</p>
                          <img src={add_img} alt="add" />
                        </button>
                    ))
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