import React from 'react'
import alarm from '../../assets/img/home/alarm.svg'
import my from '../../assets/img/home/my.svg'
import Logo from '../../assets/img/logo.svg'
import '../../assets/sass/section/home/homeheader.scss'

const HomeHeader = () => {
  return (
    <div className='container homeheader_wrap'>
        <div className="hh_left">
      <img src={Logo} alt="" />
      </div>
    <div className="hh_right">
        <img src={alarm} alt="" />
        <img src={my} alt="" />
    </div>
    </div>
  )
}

export default HomeHeader
