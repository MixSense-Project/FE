import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Nav from '../../components/Nav';
import graphic from '../../assets/img/AISearch/graphic.png';
import gotodj from '../../assets/img/AIDJ/gotodj.svg';

const Ai_Dj_Loading = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { leftSong, rightSong } = location.state || {};

  const isProcessing = useRef(false);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const startMixing = async () => {
      if (!leftSong || !rightSong) {
        navigate('/ai_dj');
        return;
      }

      if (isProcessing.current) return;
      isProcessing.current = true;

      // 디버깅 로그
      console.log('leftSong', leftSong);
      console.log('rightSong', rightSong);

      const leftMixId = leftSong?.mix_track_id ?? leftSong?.id;
      const rightMixId = rightSong?.mix_track_id ?? rightSong?.id;
      console.log('mix ids', leftMixId, rightMixId);

      if (!leftMixId || !rightMixId) {
        alert('선택한 곡의 mix_track_id를 찾을 수 없습니다.');
        navigate('/ai_dj');
        return;
      }

      try {
        console.log('🚀 ID 기반 믹싱 요청 중...');

        const formData = new FormData();
        formData.append('mix_track_id_1', leftMixId);
        formData.append('mix_track_id_2', rightMixId);
        formData.append('target_duration', '60');
        formData.append('target_k', '5');
        formData.append('save_result', 'true');

        const response = await axios.post(`${BASE_URL}/api/ai/mix`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': '69420',
          },
        });

        if (response.status === 200) {
          console.log('✅ 믹싱 성공!', response.data);
          navigate('/ai_dj_result', {
            state: {
              mixData: response.data,
              songs: { left: leftSong, right: rightSong },
            },
          });
        }
      } catch (error) {
        console.error('❌ 믹싱 에러 상세:', error.response?.data);

        const errorDetail = error.response?.data?.detail;
        const displayMsg =
          typeof errorDetail === 'object'
            ? JSON.stringify(errorDetail, null, 2)
            : errorDetail || error.message;

        alert(`Mixing failed:\n${displayMsg}`);
        navigate('/ai_dj');
      }
    };

    startMixing();
  }, [leftSong, rightSong, navigate, BASE_URL, token]);

  return (
    <div id="Ai_Dj_Loading_wrap">
      <div className="container">
        <Header />
        <div className="scroll_container">
          <div className="step"><div className="line"></div></div>
          <header>
            <h1>Mixing your sense...</h1>
            <p>Retrieving tracks from storage using Mix IDs.</p>
          </header>
          <main>
            <img src={graphic} alt="" />
            <div className="text">AI is creating your unique remix.<br />Please wait a moment.</div>
            <img src={gotodj} alt="" className="gotodj" />
            <button className="remix_highlight_btn">Listen to Remix Highlights</button>
          </main>
        </div>
      </div>
      <Nav />
    </div>
  );
};

export default Ai_Dj_Loading;