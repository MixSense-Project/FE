import React, { useEffect } from 'react'
import { useState, useRef } from 'react'
import { data, Link } from 'react-router-dom'
import Header from '../../components/Header'
import Searchbar from '../../components/Home/Searchbar'
import Nav from '../../components/Nav'
import Track from '../../components/Home/Track'
import Musiclist from '../../components/Home/Musiclist'
import Musicplay from '../../components/Home/Musicplay'
import more_btn from '../../assets/img/home/more_btn.svg'
import axios from 'axios'
import banner_img from '../../assets/img/home/banner.png'

const Home = () => {
  const tracks = Array.from({ length: 18 });

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  //Recommend Track api 연동

  const [recommendTracks, setRecommendTracks] = useState([]);

  const fetchRecommend = async () => {
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      
      const token = localStorage.getItem('access_token'); 

      if (!token) {
        console.error("로컬 스토리지에 access_token이 없습니다. 로그인이 필요합니다.");
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/ai/recommend/home`, {
        headers: {
          "ngrok-skip-browser-warning": "69420",
          "Authorization": `Bearer ${token}` 
        }
    });

    console.log("Recommend 서버 데이터:", response.data);

    // 추천 API 응답 구조가 trending과 같다면 recommend 배열을 추출합니다.
    if (response.data && response.data.recommend) {
      setRecommendTracks(response.data.recommend);
    } else if (Array.isArray(response.data)) {
      setRecommendTracks(response.data);
    }

  } catch (error) {
    // 401 에러 발생 시 출력되는 메시지입니다.
    console.error("추천 트랙 로드 실패:", error.response?.status === 401 ? "토큰 인증 실패" : error.message);
  }
};

useEffect(() => {
  fetchRecommend();
}, []);


  //Trending Now api 연동
  const [trendingTracks, setTrendingTracks] = useState([]);

  const fetchTrending = async () =>{
    try{
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.get(`${BASE_URL}/api/trending?limit=4`,{
        headers:{"ngrok-skip-browser-warning": "69420"}
    });

    console.log("서버 데이터:", response.data);
    if (response.data && response.data.trending) {
        setTrendingTracks(response.data.trending);
      }
    
    }catch (error){
      console.log(error)
      }
    }

    useEffect(()=>{
      fetchTrending();
    }, []);



  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      // 현재 스크롤 위치를 너비로 나누어 인덱스 계산 (0 또는 1)
      const index = Math.round(scrollLeft / offsetWidth);
      setActiveIndex(index);
    }
  };



  return (
    <div className='home_wrap'>
        <div className="container">
          <Header/>
          <div className="scroll_container">
            <div className="banner">
              <img src={banner_img} alt="" />
            </div>
            <div className="Recommend_track">
              <div className="text">Recommend Track</div>
          <div className="track_container" ref={scrollRef} onScroll={handleScroll}>
              {[0, 1].map((pageIndex) => (
                <div className="track_page" key={pageIndex}>
                  {recommendTracks.length > 0 ? (
                    recommendTracks.slice(pageIndex * 9, (pageIndex + 1) * 9).map((item, i) => (
                      <Track 
                        key={item.id || i} 
                        img={item.track?.track_image_url || item.track_image_url || item.image_url} 
                      />
                    ))
                  ) : (
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
                trendingTracks.map((item) => (
                  <Musiclist key={item.id} data={item} />
                ))
              ) : (
                <p style={{ textAlign: 'center', padding: '20px' }}>Loading trending...</p>
              )}
            </div>
            <Musicplay/>
          </div>  
          </div>
        <Nav/>
    </div>
  )
}

export default Home
