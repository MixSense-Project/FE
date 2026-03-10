import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useMusic } from '../../context/MusicContext'; 
import Header from '../../components/Header';
import Nav from '../../components/Nav';
import Track from '../../components/Home/Track';
import Musiclist from '../../components/Home/Musiclist';
import more_btn from '../../assets/img/home/more_btn.svg';
import banner_img from '../../assets/img/home/banner.png';
import axios from 'axios';

const Home = () => {
  const { setCurrentTrack } = useMusic(); 
  const [activeIndex, setActiveIndex] = useState(0);
  const [recommendTracks, setRecommendTracks] = useState([]);
  const [trendingTracks, setTrendingTracks] = useState([]);
  const scrollRef = useRef(null);

  const fetchRecommend = async () => {
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem('access_token'); 
      if (!token) return;
      const response = await axios.get(`${BASE_URL}/api/ai/recommend/home`, {
        headers: { "ngrok-skip-browser-warning": "69420", "Authorization": `Bearer ${token}` }
      });
      if (response.data && response.data.home) {
        setRecommendTracks(response.data.home);
      }
    } catch (error) { console.error("추천 로드 실패:", error); }
  };

  const fetchTrending = async () => {
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.get(`${BASE_URL}/api/trending?limit=4`, {
        headers: { "ngrok-skip-browser-warning": "69420" }
      });
      if (response.data && response.data.trending) {
        setTrendingTracks(response.data.trending);
      }
    } catch (error) { console.error("트렌딩 로드 실패:", error); }
  };

  useEffect(() => { fetchRecommend(); fetchTrending(); }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      setActiveIndex(Math.round(scrollLeft / offsetWidth));
    }
  };

  return (
    <div className='home_wrap'>
      <div className="container">
        <Header />
        <div className="scroll_container">
          <Link to='/ai_dj_onboarding'>
            <div className="banner"><img src={banner_img} alt="banner" /></div>
          </Link>
          <div className="Recommend_track">
            <div className="text">Recommend Track</div>
            <div className="track_container" ref={scrollRef} onScroll={handleScroll}>
              {[0, 1].map((pageIndex) => (
                <div className="track_page" key={pageIndex}>
                  {recommendTracks.length > 0 ? (
                    recommendTracks.slice(pageIndex * 9, (pageIndex + 1) * 9).map((item, i) => {
                      const videoId = item.youtube_video_id || item.track?.youtube_video_id;
                      return (
                        <Track 
                        key={item.track_id || i} 
                        img={videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null}
                        onClick={() => {
                          // 만약 item 자체가 트랙 정보라면 그대로 전달
                          // 만약 item.track 안에 정보가 들어있다면 item.track을 전달해야 합니다.
                          const trackData = item.track ? item.track : item;
                          setCurrentTrack(trackData); 
                        }} 
                        />
                      );
                    })
                  ) : (
                    // 데이터 로딩 전 보여줄 빈 칸들
                    Array.from({ length: 9 }).map((_, i) => <Track key={i} />)
                  )}
                </div>
              ))}
            </div>
            {/* 인디케이터(점) 로직 유지 */}
            <div className="indicator_container">
              <div className={`dot ${activeIndex === 0 ? 'active' : ''}`}></div>
              <div className={`dot ${activeIndex === 1 ? 'active' : ''}`}></div>
            </div>
          </div>

          <div className="Trending_now">
            <Link to='/home_trending_now'>
              <div className="text_container">
                <div className="text">Trending Now</div>
                <img src={more_btn} alt="more" />
              </div>
            </Link>
            {trendingTracks.length > 0 ? (
              trendingTracks.map((item) => (
                <Musiclist 
                  key={item.id} 
                  data={item} 
                  onPlay={() => setCurrentTrack(item)} 
                />
              ))
            ) : (
              <p style={{ textAlign: 'center', padding: '20px' }}>Loading trending...</p>
            )}
          </div>
        </div>
      </div>
      <Nav/>
    </div>
  );
};

export default Home;