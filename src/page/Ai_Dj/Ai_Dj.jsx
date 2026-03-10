import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import add from "../../assets/img/AIDJ/gray_add_btn.svg";
import question from "../../assets/img/AIDJ/question.svg";
import play_btn from "../../assets/img/AIDJ/play_btn.svg";

const Ai_Dj = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [leftSong, setLeftSong] = useState(null);
  const [rightSong, setRightSong] = useState(null);

  useEffect(() => {
    if (location.state) {
      const { selectedSong, target, prevData } = location.state;
      if (prevData) {
        if (prevData.left) setLeftSong(prevData.left);
        if (prevData.right) setRightSong(prevData.right);
      }
      if (target === "left") setLeftSong(selectedSong);
      if (target === "right") setRightSong(selectedSong);
    }
  }, [location.state]);

  // 믹스 버튼 클릭 시 호출
  const handleMixClick = () => {
    if (!leftSong || !rightSong) {
      alert("Please select two songs to mix.");
      return;
    }
    // 로딩 페이지로 선택된 곡 정보 전달
    navigate('/ai_dj_loading', { state: { leftSong, rightSong } });
  };

  return (
    <div className="aidj_wrap">
      <div className="container">
        <Header />
        <div className="scroll_container">
          <div className="step"><div className="line"></div></div>
          <div className="aidj_main">
            <h1>Track Select</h1>
            <p>Add two songs you want to mix.</p>
            <div className="mix">
              <div className="mix_left">
                <div className="mix_cover" style={{
                  backgroundImage: leftSong ? `url(https://img.youtube.com/vi/${leftSong.youtube_video_id}/mqdefault.jpg)` : 'none',
                  backgroundSize: 'cover', backgroundPosition: 'center'
                }}>
                  <Link to="/ai_dj_trackselect" state={{ target: "left", prevData: { left: leftSong, right: rightSong } }}>
                    <button className="track_add_btn">{!leftSong && <img src={add} alt="" />}</button>
                  </Link>
                </div>
                <h2>{leftSong ? leftSong.title : "Music"}</h2>
                <p>{leftSong ? leftSong.artist : "Artist"}</p>
              </div>

              <div className="mix_right">
                <div className="mix_cover" style={{
                  backgroundImage: rightSong ? `url(https://img.youtube.com/vi/${rightSong.youtube_video_id}/mqdefault.jpg)` : 'none',
                  backgroundSize: 'cover', backgroundPosition: 'center'
                }}>
                  <Link to="/ai_dj_trackselect" state={{ target: "right", prevData: { left: leftSong, right: rightSong } }}>
                    <button className="track_add_btn">{!rightSong && <img src={add} alt="" />}</button>
                  </Link>
                </div>
                 <h2>{rightSong ? rightSong.title : "Music"}</h2>
                <p>{rightSong ? rightSong.artist : "Artist"}</p>
              </div>
            </div>

            {/* Link 대신 일반 버튼으로 로직 처리 */}
            <button className="mix_btn" onClick={handleMixClick}>AI Mix</button>

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