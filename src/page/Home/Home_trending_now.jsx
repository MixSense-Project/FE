import React, { useEffect, useState } from 'react';
import SubHeader from '../../components/SubHeader';
import Searchbar from '../../components/Home/Searchbar';
import Musiclist from '../../components/Home/Musiclist';
import Nav from '../../components/Nav';
import Popup from '../Music/Popup'; // ✅ Popup 컴포넌트 추가
import axios from 'axios';
import { useMusic } from '../../context/MusicContext';

const Home_trending_now = () => {
  const { setCurrentTrack } = useMusic();
  const [trendingTracks, setTrendingTracks] = useState([]);

  // ✅ 팝업 관련 상태 추가
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

  // ✅ 팝업 핸들러 추가
  const handleOpenPopup = (trackData, pos) => {
    setSelectedTrack(trackData);
    setPopupPos(pos);
    setIsPopupOpen(true);
  };

  const fetchTrending = async () => {
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.get(`${BASE_URL}/api/trending`, {
        headers: { "ngrok-skip-browser-warning": "69420" }
      });

      if (response.data && response.data.trending) {
        setTrendingTracks(response.data.trending);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  return (
    <div className="home_trendging_now">
      <div className="container">
        <SubHeader title="Trending Now" />
        <div className="scroll_container">
          {trendingTracks.length > 0 ? (
            trendingTracks.map((item) => (
              <Musiclist 
                key={item.id} 
                data={item} 
                onPlay={() => setCurrentTrack(item)} 
                // ✅ onAdd 연결 (좌표와 곡 정보 전달)
                onAdd={handleOpenPopup} 
              />
            ))
          ) : (
            <p style={{ textAlign: 'center', padding: '20px' }}>Loading trending...</p>
          )}
        </div>
      </div>
      <Nav />

      {/* ✅ 팝업 렌더링 추가 */}
      {isPopupOpen && (
        <Popup 
          onClose={() => setIsPopupOpen(false)} 
          specificTrack={selectedTrack} 
          position={popupPos} 
        />
      )}
    </div>
  );
};

export default Home_trending_now;