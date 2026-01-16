import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import Searchbar from '../../components/Home/Searchbar'
import Nav from '../../components/Nav'
import Track from '../../components/Home/Track'
import Musiclist from '../../components/Home/Musiclist'
import Musicplay from '../../components/Home/Musicplay'
import more_btn from '../../assets/img/Home/more_btn.svg'

const Home = () => {
  return (
    <div className='home_wrap'>
        <div className="container">
          <Header/>
          <div className="scroll_container">
            <div className="banner"></div>
          <div className="Recommend_track">
            <div className="text">Recommend Track</div>
            <div className="track_container">
              <Track/>
              <Track/>
              <Track/>
              <Track/>
              <Track/>
              <Track/>
              <Track/>
              <Track/>
              <Track/>
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
