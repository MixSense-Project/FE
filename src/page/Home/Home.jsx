import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Nav from '../../components/Nav';
import Track from '../../components/Home/Track';
import Musiclist from '../../components/Home/Musiclist';
import Musicplay from '../../components/Home/Musicplay';
import more_btn from '../../assets/img/home/more_btn.svg';
import banner_img from '../../assets/img/home/banner.png';
import axios from 'axios';

const Home = () => {
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
        headers: {
          "ngrok-skip-browser-warning": "69420",
          "Authorization": `Bearer ${token}` 
        }
      });

      // [수정] 스크린샷 로그 확인 결과, 데이터가 'home' 키 안에 들어있습니다.
      console.log("Recommend 서버 데이터:", response.data);
      if (response.data && response.data.home) {
        setRecommendTracks(response.data.home);
      }
    } catch (error) {
      console.error("추천 트랙 로드 실패:", error);
    }
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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRecommend();
    fetchTrending();
  }, []);

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
          <div className="banner"><img src={banner_img} alt="" /></div>
          
          <div className="Recommend_track">
            <div className="text">Recommend Track</div>
            <div className="track_container" ref={scrollRef} onScroll={handleScroll}>
              {[0, 1].map((pageIndex) => (
                <div className="track_page" key={pageIndex}>
                  {recommendTracks.length > 0 ? (
                    recommendTracks.slice(pageIndex * 9, (pageIndex + 1) * 9).map((item, i) => {
                      // 유튜브 ID 추출 (스크린샷 기준 item 바로 아래에 존재)
                      const videoId = item.youtube_video_id;
                      
                      return (
                        <Track 
                          key={item.track_id || i} 
                          // 고화질(hqdefault) 썸네일 URL 생성
                          img={videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null} 
                        />
                      );
                    })
                  ) : (
                    // 데이터가 없을 때 보여줄 빈 슬롯
                    Array.from({ length: 9 }).map((_, i) => <Track key={i} />)
                  )}
                </div>
              ))}
            </div>
            <div className="indicator_container">
              <div className={`dot ${activeIndex === 0 ? 'active' : ''}`}></div>
              <div className={`dot ${activeIndex === 1 ? 'active' : ''}`}></div>
            </div>
          </div>

          <div className="Trending_now">
            <Link to='/home_trending_now'>
              <div className="text_container">
                <div className="text">Trending Now</div>
                <img src={more_btn} alt="" />
              </div>
            </Link>
            {trendingTracks.length > 0 ? (
              trendingTracks.map((item) => <Musiclist key={item.id} data={item} />)
            ) : (
              <p style={{ textAlign: 'center', padding: '20px' }}>Loading trending...</p>
            )}
          </div>
          <Musicplay />
        </div>
      </div>
      <Nav />
    </div>
  );
};

export default Home;