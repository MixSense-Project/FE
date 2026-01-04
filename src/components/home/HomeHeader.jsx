import React from 'react'
import alarm from '../../assets/img/Home/alarm.svg'
import my from '../../assets/img/Home/my.svg'
import Logo from '../../assets/img/logo.svg'
import { Link } from 'react-router-dom'
import MyPage from '../Mypage/MyPage'

const HomeHeader = () => {
  return (
    <div className='container homeheader_wrap'>
        <div className="hh_left">
      <img src={Logo} alt="" />
      </div>
      <Link to="/mypage">
        <div className="hh_right">
            <img src={my} alt="" />
        </div>
      </Link>
    </div>
  )
}

export default HomeHeader
