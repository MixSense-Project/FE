import React from 'react'
import Header from '../../components/Header'
import Searchbar from '../../components/Home/Searchbar'
import Nav from '../../components/Nav'

const Home_trending_now = () => {
  return (
    <div className="home_trendging_now">
        <div className="container">
          <Header title="Trending Now"/>
          <Searchbar/>
        </div>
        <Nav/>
    </div>
  )
}

export default Home_trending_now