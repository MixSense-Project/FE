import React from 'react'
import alarm from '../../assets/img/Home/alarm.svg'
import my from '../../assets/img/Home/my.svg'
import Logo from '../../assets/img/logo.svg'

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
