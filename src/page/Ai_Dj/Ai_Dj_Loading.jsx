import React from 'react'
import Header from '../../components/Header'
import Nav from '../../components/Nav'
import graphic from '../../assets/img/AISearch/graphic.png'
import gotodj from '../../assets/img/AIDJ/gotodj.svg'

const Ai_Dj_Loading = () => {
  return (
    <div id="Ai_Dj_Loading_wrap">
        <div className="container">
            <Header/>
            <div className="scroll_container">
              <div className="step">
                <div className="line"></div>
              </div>
              <header>
                <h1>Mixing your sense...</h1>
                <p>MixSense is trying to find a point of contact
                  <br /> between the two songs
                </p>
              </header>
              <main>
                <img src={graphic} alt="" />
                <div className="text">
                  Hear only the highlights
                  <br />before the AI mix is generated.
                </div>
                <img src={gotodj} alt="" className="gotodj" />
                <button className="remix_highlight_btn">
                  Listen to Remix Highlights
                </button>
              </main>
            </div>
        </div>
        <Nav/>
    </div>
  )
}

export default Ai_Dj_Loading