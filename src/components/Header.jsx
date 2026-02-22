import React from 'react'
import my from '../assets/img/home/my.svg'
import Logo from '../assets/img/logo.svg'
import search_icon from '../assets/img/nav/search_g.svg'
import { Link } from 'react-router-dom'


const Header = () => {
  return (
    <div className='header_wrap'>
      <div className="header_content">
        <div className="hh_left">
          <img src={Logo} alt="" />
        </div>
        <div className="hh_right">
            <Link to='/home_search'>
              <img src={search_icon} alt="" />
            </Link>
            <Link to='/mypage'>
              <img src={my} alt="" />
            </Link>
        </div>
      </div>
    </div>
  )
}

export default Header
