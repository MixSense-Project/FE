import React from 'react'
import { Link } from 'react-router-dom'
import back_btn from '../assets/img/Header/back_btn.svg'

const Header = ({title}) => {
  return (
     <div id='Header_Wrap'>
        <Link to="/home">
          <button className="back_btn">
              <img src={back_btn} alt="" />
          </button>
        </Link>
        <h1>{title}</h1>
    </div>
  )
}

export default Header