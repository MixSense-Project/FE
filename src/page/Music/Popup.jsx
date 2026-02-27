import React, { useState, useEffect } from 'react' // 1. useState, useEffect 추가
import aidj_img from '../../assets/img/Music/aidj.svg'
import share__img from '../../assets/img/Music/share.svg'
import add_img from '../../assets/img/Music/add.svg'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Popup = ({onClose}) => {
  // 2. 누락된 상태값들 정의
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  // 플레이리스트 목록 GET 요청
  const fetchPlaylists = async () => {
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem('access_token');
      
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

      if (response.data && response.data.playlists) {
        setPlaylists(response.data.playlists);
      } else {
        setPlaylists(response.data);
      }
    } catch (error) {
      console.error("플레이리스트 로드 실패:", error);
    } finally {
      setLoading(false); // 로딩 완료
    }
  };

  // 3. 컴포넌트가 마운트될 때 함수 실행
  useEffect(() => {
    fetchPlaylists();
  }, []);
  
  return (
    <div className="Popup_Overlay" onClick={onClose}> 
        <div id="Popup_Wrap" onClick={(e) => e.stopPropagation()}>
            <Link to='/ai_dj'>
              <button className="aidj list">
                  <p>Go to AI DJ</p>
                  <img src={aidj_img} alt="ai dj" />
              </button>
            </Link>
            <button className="share list">
                <p>Share</p>
                <img src={share__img} alt="share" />
            </button>

            {/* 플레이리스트 목록 영역 */}
            <div className="playlist_container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {loading ? (
                    <p style={{ color: '#fff', textAlign: 'center', padding: '10px' }}>Loading...</p>
                ) : playlists.length > 0 ? (
                    playlists.map((playlist) => (
                        <button key={playlist.id} className="add list">
                          <p>{`Add to ${playlist.title || playlist.name || "Untitled Playlist"}`}</p>                            <img src={add_img} alt="add" />
                        </button>
                    ))
                ) : (
                    <div className="add list" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <p>No Playlists found</p>
                        <img src={add_img} alt="none" />
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default Popup