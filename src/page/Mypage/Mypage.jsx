import React from 'react'
import Header from '../../components/Header'
import Nav from '../../components/Nav'

const MyPage = () => {
  return (
    <div className='container mypage_wrap'>
        <Header title={"MyPage"}/>
        <Nav />
    </div>
  )
}

export default MyPage