import React from 'react'
import Header from '../../components/Header'
import Searchbar from '../../components/Home/Searchbar'
import Musiclist from '../../components/Home/Musiclist'
import Nav from '../../components/Nav'

const Home_trending_now = () => {
  return (
    <div className="home_trendging_now">
        <div className="container">
          <Header title="Trending Now"/>
          <Searchbar/>
          <Musiclist/>
        </div>
        <Nav/>
    </div>
  )
}

export default Home_trending_now