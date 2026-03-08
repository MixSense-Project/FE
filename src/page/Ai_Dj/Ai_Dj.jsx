import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import add from "../../assets/img/AIDJ/gray_add_btn.svg";
import question from "../../assets/img/AIDJ/question.svg";

const Ai_Dj = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [leftSong, setLeftSong] = useState(null);
  const [rightSong, setRightSong] = useState(null);

  useEffect(() => {
    // 1. 넘어온 state가 있는지 확인
    if (location.state) {
      const { selectedSong, target, prevData } = location.state;

      // 2. 이전에 선택했던 데이터 복구 (데이터 유실 방지)
      if (prevData) {
        setLeftSong(prevData.left || null);
        setRightSong(prevData.right || null);
      }

      // 3. 이번에 새로 선택한 곡을 타겟에 맞게 저장
      if (target === "left") setLeftSong(selectedSong);
      if (target === "right") setRightSong(selectedSong);
      
      // 4. (선택사항) 데이터 확인용 로그
      console.log("받은 곡 정보:", selectedSong);
    }
  }, [location.state]);

  return (
    <div className="aidj_wrap">
      <div className="container">
        <Header />
        <div className="scroll_container">
          <div className="aidj_main">
            <h1>Track Select</h1>
            <p>Add two songs you want to mix.</p>

            <div className="mix">
              {/* 왼쪽 곡 슬롯 */}
              <div className="mix_left">
                <div 
                  className="mix_cover"
                  style={leftSong ? { 
                    backgroundImage: `url(https://img.youtube.com/vi/${leftSong.youtube_video_id}/mqdefault.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  } : {}}
                >
                  <Link to="/ai_dj_trackselect" state={{ target: "left", prevData: { left: leftSong, right: rightSong } }}>
                    <button className="track_add_btn">
                      {!leftSong && <img src={add} alt="add" />}
                    </button>
                  </Link>
                </div>
                {/* 데이터가 있으면 제목/아티스트 표시, 없으면 기본 텍스트 */}
                <h2>{leftSong ? leftSong.title : "Music"}</h2>
                <p>{leftSong ? leftSong.artist : "Artist"}</p>
              </div>

              {/* 오른쪽 곡 슬롯 */}
              <div className="mix_right">
                <div 
                  className="mix_cover"
                  style={rightSong ? { 
                    backgroundImage: `url(https://img.youtube.com/vi/${rightSong.youtube_video_id}/mqdefault.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  } : {}}
                >
                  <Link to="/ai_dj_trackselect" state={{ target: "right", prevData: { left: leftSong, right: rightSong } }}>
                    <button className="track_add_btn">
                      {!rightSong && <img src={add} alt="add" />}
                    </button>
                  </Link>
                </div>
                <h2>{rightSong ? rightSong.title : "Music"}</h2>
                <p>{rightSong ? rightSong.artist : "Artist"}</p>
              </div>
            </div>

            <Link to='/ai_dj_loading'>
              <button className={`mix_btn ${leftSong && rightSong ? "active" : ""}`}>AI Mix</button>
            </Link>
          </div>
        </div>
      </div>
      <Nav />
    </div>
  );
};

export default Ai_Dj;