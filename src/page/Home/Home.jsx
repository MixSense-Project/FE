import React from 'react'
import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import Searchbar from '../../components/Home/Searchbar'
import Nav from '../../components/Nav'
import Track from '../../components/Home/Track'
import Musiclist from '../../components/Home/Musiclist'
import Musicplay from '../../components/Home/Musicplay'
import more_btn from '../../assets/img/home/more_btn.svg'

const Home = () => {
  const tracks = Array.from({ length: 18 });

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

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
            <div className="banner"></div>
            <div className="Recommend_track">
              <div className="text">Recommend Track</div>
              <div className="track_container" ref={scrollRef} onScroll={handleScroll}>
                {[0, 1].map((pageIndex) => (
                  <div className="track_page" key={pageIndex}>
                    {tracks.slice(pageIndex * 9, (pageIndex + 1) * 9).map((_, i) => (
                      <Track key={i} />
                    ))}
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
              <Musiclist/>
              <Musiclist/>
              <Musiclist/>
              <Musiclist/>
            </div>
            <Musicplay/>
          </div>  
          </div>
        <Nav/>
    </div>
  )
}

export default Home
