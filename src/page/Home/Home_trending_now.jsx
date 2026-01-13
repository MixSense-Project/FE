import React from 'react'
import SubHeader from '../../components/SubHeader'
import Searchbar from '../../components/Home/Searchbar'
import Musiclist from '../../components/Home/Musiclist'
import Nav from '../../components/Nav'

const Home_trending_now = () => {
  return (
    <div className="home_trendging_now">
        <div className="container">
          <SubHeader title="Trending Now"/>
          <Searchbar/>
          <div className="scroll_container">
            <Musiclist/>
            <Musiclist/>
            <Musiclist/>
            <Musiclist/>
            <Musiclist/>
            <Musiclist/>
            <Musiclist/>
            <Musiclist/>
            <Musiclist/>
            <Musiclist/>
          </div>
        </div>
        <Nav/>
    </div>
  )
}

export default Home_trending_now