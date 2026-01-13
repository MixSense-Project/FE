import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../../components/Header'
import Nav from '../../components/Nav'
import add from '../../assets/img/AIDJ/gray_add_btn.svg'
import question from '../../assets/img/AIDJ/question.svg'
import play_btn from '../../assets/img/AIDJ/play_btn.svg'

const Ai_Dj = () => {
  const navigate = useNavigate();
  
  return (
    <div className='aidj_wrap'>
      <div className="container">
        <Header />
        <div className="scroll_container">
          <div className="aidj_header">
          <div className="aidj_cover"></div>
          <div className="aidj_cover"></div>
          <div className="aidj_cover"></div>
        </div>
        <div className="aidj_main">
          <h1>Track Select</h1>
          <p>Add two songs you want to mix.</p>
          <div className="mix">
            <div className="mix_left">
              <div className="mix_cover">
                <Link to='/ai_dj_trackselect'>
                  <button className="track_add_btn">
                    <img src={add} alt="" />
                  </button>
                </Link>
              </div>
              <h2>Music</h2>
              <p>Artist</p>
            </div>
            <div className="mix_right">
              <h2>Music</h2>
              <p>Artist</p>
              <div className="mix_cover">
                <Link to='/ai_dj_trackselect'>
                  <button className="track_add_btn">
                    <img src={add} alt="" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <button className="mix_btn">
            AI Mix
          </button>

          <div className="preview">
            <h1>Remix Preview</h1>
            <p>Hear only the highlights before the AI mix is <br />
              generated.
            </p>
            <div className="pre_music">
              <div className="pre_cover">
                <img src={play_btn} alt="" />
              </div>
              <div className="pre_detial">
                <h3>Music X Music <br />
                  Remix highlights</h3>
                <p>30s</p>
              </div>
            </div>
          </div>
          <div className="what" onClick={() => navigate("/ai_dj_onboarding")}>
            <img src={question} alt="" className="question" />
            <p>What is the AI DJ?</p>
          </div>
        </div>
        </div>
      </div>
      <Nav />
    </div>
  )
}

export default Ai_Dj