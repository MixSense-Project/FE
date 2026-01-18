import React, { useEffect, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import add from "../../assets/img/AIDJ/gray_add_btn.svg";
import question from "../../assets/img/AIDJ/question.svg";
import play_btn from "../../assets/img/AIDJ/play_btn.svg";

const Ai_Dj = () => {
  const navigate = useNavigate();

  return (
    <div className="aidj_wrap">
      <div className="container">
        <Header />
        <div className="scroll_container">

          <div className="step">
            <div className="line"></div>
          </div>

          <div className="aidj_main">
            <h1>Track Select</h1>
            <p>Add two songs you want to mix.</p>

            <div className="mix">
              <div className="mix_left">
                <div className="mix_cover">
                  <Link to="/ai_dj_trackselect">
                    <button className="track_add_btn">
                      <img src={add} alt="" />
                    </button>
                  </Link>
                </div>
                <h2>Music</h2>
                <p>Artist</p>
              </div>

              <div className="mix_right">
                <div className="mix_cover">
                  <Link to="/ai_dj_trackselect">
                    <button className="track_add_btn">
                      <img src={add} alt="" />
                    </button>
                  </Link>
                </div>
                 <h2>Music</h2>
                <p>Artist</p>
              </div>
            </div>

           <Link to='/ai_dj_loading'>
              <button className="mix_btn">AI Mix</button>
           </Link>

            <div className="what" onClick={() => navigate("/ai_dj_onboarding")}>
              <img src={question} alt="" className="question" />
              <p>What is the AI DJ?</p>
            </div>
          </div>
        </div>
      </div>
      <Nav />
    </div>
  );
};

export default Ai_Dj;
