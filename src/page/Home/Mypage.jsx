import React from 'react'
import Header from '../../components/Header'
import Nav from '../../components/Nav'

const MyPage = () => {
  return (
    <div className='mypage_wrap'>
        <div className="container">
          <Header title={"MyPage"}/>
          <div className="profile">
            <input type="image" src="" alt="" />
          </div>
          <div className="name">
            <input type="text" />
          </div>
          <div className="btn">
            <button className="logout">Logout</button>
            <button className="logout">Unsubscribe</button>
          </div>
        </div>
        <Nav />
    </div>
  )
}

export default MyPage