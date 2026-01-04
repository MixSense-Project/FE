import React from 'react'
import Nav from '../Nav'
import HomeHeader from './HomeHeader'
import '../../assets/sass/section/home/home.scss'
import search_icon from '../../assets/img/nav/search_g.svg'

const Home = () => {
  return (
    <div className='container home_wrap'>
        <HomeHeader/>
        <div className="search_bar">
          <img src={search_icon} alt="" className="search_icon" />
          <p>Search</p>
        </div>
      <Nav/>
    </div>
  )
}

export default Home
