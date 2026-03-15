import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useMusic } from '../../context/MusicContext';
import aidj_img from '../../assets/img/Music/aidj.svg';
import share__img from '../../assets/img/Music/share.svg';
import add_img from '../../assets/img/Music/add.svg';

const Popup = ({ onClose, specificTrack, position }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentTrack } = useMusic();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        if (!token) { setLoading(false); return; }
        const response = await axios.get(`${BASE_URL}/api/playlists`, {
          headers: { "ngrok-skip-browser-warning": "69420", "Authorization": `Bearer ${token}` }
        });
        setPlaylists(response.data.playlists || response.data);
      } catch (error) { console.error("로드 실패:", error); } finally { setLoading(false); }
    };
    fetchPlaylists();
  }, [token]);

  const handleAddToPlaylist = async (playlistId) => {
    const target = specificTrack || currentTrack;
    const finalTrackId = target?.track?.track_id || target?.track_id || target?.id;
    if (!finalTrackId) { alert("추가할 곡 정보가 없습니다."); return; }
    try {
      await axios.post(`${BASE_URL}/api/playlists/${playlistId}/tracks`, { track_id: finalTrackId }, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      alert("곡이 추가되었습니다!");
      onClose(); 
    } catch (error) { alert(error.response?.data?.message || "추가 실패"); }
  };

  const handleShare = () => {
    const target = specificTrack || currentTrack;
    const videoId = target?.track?.youtube_video_id || target?.youtube_video_id || target?.video_id;
    if (videoId) {
      navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${videoId}`).then(() => { alert("링크 복사 완료!"); onClose(); });
    }
  };

  // ✅ 위치 스타일 계산 수정
  let popupWrapStyle = {
    position: 'absolute',
    zIndex: 10001,
  };

  if (position) {
    // 부모 컨테이너(.home_wrap 등) 중앙을 기준으로 팝업을 띄웁니다.
    popupWrapStyle = {
      ...popupWrapStyle,
      top: `${position.y - 150}px`, // 클릭한 위치보다 위쪽으로 띄움
      left: '50%',
      transform: 'translateX(-15%)', // 모바일 프레임 가로 중앙 정렬
      width: '187px',                // 팝업 너비 적정값 고정
    };
  }

  return (
    /* ✅ Overlay를 absolute로 설정하여 relative 부모(모바일 프레임) 내에 고정 */
    <div 
      className="Popup_Overlay" 
      onClick={onClose}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        // backgroundColor: 'rgba(0,0,0,0.5)', 
        zIndex: 10000,
        borderRadius: 'inherit' // 부모의 테두리 둥글기 상속 (선택사항)
      }}
    > 
        <div 
          id="Popup_Wrap" 
          onClick={(e) => e.stopPropagation()} 
          style={popupWrapStyle}
        >
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

            <div className="playlist_container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {loading ? (
                    <p style={{ color: '#fff', textAlign: 'center', padding: '10px' }}>Loading...</p>
                ) : playlists.length > 0 ? (
                    playlists.map((playlist) => (
                        <button key={playlist.id} className="add list" onClick={() => handleAddToPlaylist(playlist.id)}>
                          <p>{`Add to ${playlist.title || "Playlist"}`}</p>
                          <img src={add_img} alt="add" />
                        </button>
                    ))
                ) : (
                    <div className="add list"><p>No Playlists found</p><img src={add_img} alt="none" /></div>
                )}
            </div>
        </div>
    </div>
  );
};

export default Popup;