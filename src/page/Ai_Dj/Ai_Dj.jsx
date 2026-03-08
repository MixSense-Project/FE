import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import add from "../../assets/img/AIDJ/gray_add_btn.svg";
import question from "../../assets/img/AIDJ/question.svg";
import play_btn from "../../assets/img/AIDJ/play_btn.svg"; // 기존에 있던 play_btn 유지

const Ai_Dj = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 데이터 보존을 위한 상태값
  const [leftSong, setLeftSong] = useState(null);
  const [rightSong, setRightSong] = useState(null);

  useEffect(() => {
    if (location.state) {
      const { selectedSong, target, prevData } = location.state;
      // 이전 데이터 복구 (기존 곡 유지)
      if (prevData) {
        if (prevData.left) setLeftSong(prevData.left);
        if (prevData.right) setRightSong(prevData.right);
      }
      // 새로 선택한 곡 반영
      if (target === "left") setLeftSong(selectedSong);
      if (target === "right") setRightSong(selectedSong);
    }
  }, [location.state]);

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
                {/* 기존 구조 그대로 유지, style만 추가 */}
                <div className="mix_cover" style={{
                  backgroundImage: leftSong ? `url(https://img.youtube.com/vi/${leftSong.youtube_video_id}/mqdefault.jpg)` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  <Link to="/ai_dj_trackselect" state={{ target: "left", prevData: { left: leftSong, right: rightSong } }}>
                    <button className="track_add_btn">
                      {/* 곡이 없을 때만 + 아이콘 표시 */}
                      {!leftSong && <img src={add} alt="" />}
                    </button>
                  </Link>
                </div>
                {/* 데이터가 있으면 표시, 없으면 기존 텍스트 유지 */}
                <h2>{leftSong ? leftSong.title : "Music"}</h2>
                <p>{leftSong ? leftSong.artist : "Artist"}</p>
              </div>

              <div className="mix_right">
                <div className="mix_cover" style={{
                  backgroundImage: rightSong ? `url(https://img.youtube.com/vi/${rightSong.youtube_video_id}/mqdefault.jpg)` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  <Link to="/ai_dj_trackselect" state={{ target: "right", prevData: { left: leftSong, right: rightSong } }}>
                    <button className="track_add_btn">
                      {!rightSong && <img src={add} alt="" />}
                    </button>
                  </Link>
                </div>
                 <h2>{rightSong ? rightSong.title : "Music"}</h2>
                <p>{rightSong ? rightSong.artist : "Artist"}</p>
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