import React from 'react'
import { Link } from 'react-router-dom'
import Nav from '../../components/Nav'
import Header from '../../components/Header'
import logo_img from '../../assets/img/logo.svg'
import chat_btn from '../../assets/img/AISearch/chat_btn.svg'
import main_img from '../../assets/img/AISearch/main.png'

const Ai_Search_Onboarding = () => {
  return (
    <div className="Ai_Search_Onboarding_wrap">
        <div className="container">
            <Header title={"AI Search"}/>
            <header>
                <img src={logo_img} alt="" />
                <p>MixSense AI</p>
            </header>
            <main>
                <h1>What song are you 
                <br />looking for?</h1>
                <p>
                    Describe the characteristics or mood 
                    <br />of the music you are looking for.
                </p>
                <img src={main_img} alt="" />
            </main>
            <Link to='/ai_search'>
                <div className="chat">
                    <button className="chat_btn">
                        <img src={chat_btn} alt="" />
                    </button>
                    <input type="text" />
                </div>
            </Link>
        </div>
        <Nav/>
    </div>
  )
}

export default Ai_Search_Onboarding