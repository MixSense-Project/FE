import React from 'react'
import Header from '../../components/Header'
import Nav from '../../components/Nav'
import edit_btn from '../../assets/img/Home/edit_btn.svg'

const Mypage = () => {
  return (
    <div className='mypage_wrap'>
        <div className="container">
          <Header title={"MyPage"}/>
          <div className="profile">
            <img src={edit_btn} alt="" />
            <input type="image" src="" alt="" />
          </div>
          <div className="name">
            <input type="text" />
          </div>
          <div className="btn">
            <button className="logout">Logout</button>
            <button className="logout">Unsubscribe</button>
          </div>
          <div className="area"></div>
        </div>
        <div className="area"></div>
    </div>
  )
}

export default Mypage