import React, { useEffect, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import add from "../../assets/img/AIDJ/gray_add_btn.svg";
import question from "../../assets/img/AIDJ/question.svg";
import play_btn from "../../assets/img/AIDJ/play_btn.svg";

const CARD = 160;
const GAP = 15;

const Ai_Dj = () => {
  const navigate = useNavigate();
  const headerRef = useRef(null);

  // 원본 10개 (나중에 실제 이미지 데이터로 바꿔도 됨)
  const covers = useMemo(() => Array.from({ length: 10 }, (_, i) => i), []);

  // 무한루프용으로 3번 복제 (중간 덩어리에서 시작할 거라 3배가 안정적)
  const loopCovers = useMemo(
    () => [...covers, ...covers, ...covers],
    [covers]
  );

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const groupW = covers.length * CARD + (covers.length - 1) * GAP; // 원본 1덩어리 폭
    const start = groupW + (CARD + GAP); // 가운데(2번째 덩어리) + 한 칸(피크 연출)
    el.scrollLeft = start;

    const onScroll = () => {
      // 너무 왼쪽으로 가면 -> 가운데 덩어리로 순간이동
      if (el.scrollLeft < groupW * 0.5) {
        el.scrollLeft += groupW;
        return;
      }
      // 너무 오른쪽으로 가면 -> 가운데 덩어리로 순간이동
      if (el.scrollLeft > groupW * 1.5) {
        el.scrollLeft -= groupW;
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [covers]);

  return (
    <div className="aidj_wrap">
      <div className="container">
        <Header />
        <div className="scroll_container">
          <div className="aidj_header" ref={headerRef}>
            {loopCovers.map((_, idx) => (
              <div className="aidj_cover" key={idx} />
            ))}
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
                <h2>Music</h2>
                <p>Artist</p>
                <div className="mix_cover">
                  <Link to="/ai_dj_trackselect">
                    <button className="track_add_btn">
                      <img src={add} alt="" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <button className="mix_btn">AI Mix</button>

            <div className="preview">
              <h1>Remix Preview</h1>
              <p>
                Hear only the highlights before the AI mix is <br />
                generated.
              </p>
              <div className="pre_music">
                <div className="pre_cover">
                  <img src={play_btn} alt="" />
                </div>
                <div className="pre_detial">
                  <h3>
                    Music X Music <br />
                    Remix highlights
                  </h3>
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
  );
};

export default Ai_Dj;
