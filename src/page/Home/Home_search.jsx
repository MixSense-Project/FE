import React from 'react'
import {Link} from 'react-router-dom'
import Searchbar from '../../components/Home/Searchbar'
import Nav from '../../components/Nav'
import searchicon from '../../assets/img/Nav/search_g.svg'

const Home_search = () => {
  return (
    <div className="home_searchbar_wrap">
        <div className="container">
          <div className="search">
              <div className="searchbar">
                  <img src={searchicon} alt="" />
                  <input type="text" placeholder='Search' />
              </div>
              <Link to="/home">
                  <p>취소</p>
              </Link>
          </div>
        </div>
        <Nav/>
    </div>
  )
}

export default Home_search




