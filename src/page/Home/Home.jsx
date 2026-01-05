import React from 'react'
import HomeHeader from '../Home/HomeHeader'
import Searchbar from '.././../components/Searchbar'
import Nav from '../../components/Nav'

const Home = () => {
  return (
    <div className='container home_wrap'>
        <HomeHeader/>
        <Searchbar/>
        <Nav/>
    </div>
  )
}

export default Home
