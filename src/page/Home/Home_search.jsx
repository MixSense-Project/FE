import React from 'react'
import {Link} from 'react-router-dom'
import Searchlist from '../../components/Home/Searchlist'
import Nav from '../../components/Nav'
import searchicon from '../../assets/img/Nav/search_g.svg'
import Musicplay from '../../components/Home/Musicplay'
import Searchedlist from '../../components/Home/Searchedlist'

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
          <p className='history'>history</p>
          <Searchedlist/>
          <Searchedlist/>
          <Searchedlist/>
          <Musicplay/>
        </div>
        <Nav/>
    </div>
  )
}

export default Home_search




