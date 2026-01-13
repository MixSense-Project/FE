import React from 'react'
import Header from '../../components/Header'
import Nav from '../../components/Nav'
import logo_img from '../../assets/img/logo.svg'
import chat_btn from '../../assets/img/AISearch/chat_btn.svg'

const Ai_Search = () => {
  return (
    <div className="Ai_Search_Wrap">
      <div className='container'>
        <Header/>
        <header>
            <img src={logo_img} alt="" />
            <p>MixSense AI</p>
        </header>
        <div className="chat">
            <button className="chat_btn">
                <img src={chat_btn} alt="" />
            </button>
            <input type="text" />
        </div>
      </div>
      <Nav/>
    </div>
    
  )
}

export default Ai_Search
