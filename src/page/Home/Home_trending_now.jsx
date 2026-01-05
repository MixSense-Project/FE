import React from 'react'
import Header from '../../components/Header'
import Searchbar from '../../components/Home/Searchbar'
import Nav from '../../components/Nav'

const Home_trending_now = () => {
  return (
    <div className="container home_trendging_now">
        <Header title="Trending Now"/>
        <Searchbar/>
        <Nav/>
    </div>
  )
}

export default Home_trending_now