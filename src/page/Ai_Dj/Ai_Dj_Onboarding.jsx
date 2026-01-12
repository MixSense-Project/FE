import React from 'react'
import Header from '../../components/Header'
import Nav from '../../components/Nav'
import logo from '../../assets/img/logo.svg'
import graphic from '../../assets/img/AIDJ/ai_dj_graphic.svg'
import gotodj from '../../assets/img/AIDJ/gotodj.svg'

function Ai_Dj_Onboarding() {
    return (
        <div className='aidjonboarding_wrap'>
            <div className="container">
                <Header />
                <div className="aidj_on_header">
                    <div className="logo">
                        <img src={logo} alt="" />
                    </div>
                    <div className="detail">
                        <p className='hp1'>Create <br />
                            your own DJ set</p>
                        <p className="hp2">with AI</p>
                    </div>
                </div>
                <main>
                    <p className='p1'>
                        Beyond simple playback,<br />
                        AI Agent guides your mixing journey.
                    </p>
                    <p className='p2'>
                        AI analyzes the song's BPM and beat to suggest <br />
                        natural transitions and tempo changes.
                    </p>
                    <img src={graphic} alt="" className="graphic" />
                    <p className="p3">
                        Seamless Flow, AI-Designed Mixing Plans<br />
                        Mix your songs right now
                    </p>
                    <img src={gotodj} alt="" className="gotodj" />
                    <button className="aidj_btn">
                        Go to AI DJ
                    </button>

                </main>
            </div>
            <Nav />
        </div>
    )
}

export default Ai_Dj_Onboarding
