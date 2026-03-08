import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Nav from '../../components/Nav';
import SubHeader from '../../components/SubHeader';
import Searchbar from '../../components/Home/Searchbar';
import Musiclist from '../../components/Home/Musiclist';

const Ai_Dj_Trackselect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { target, prevData } = location.state || {}; 

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pickedSong, setPickedSong] = useState(null); // 최종 선택된 곡 저장

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('access_token');

  const fetchSearch = useCallback(async (query) => {
    try {
      setLoading(true);
      const url = query.trim() === "" ? `${BASE_URL}/api/tracks` : `${BASE_URL}/api/search`;
      const response = await axios.get(url, {
        params: { query, limit: 15 },
        headers: { "Authorization": `Bearer ${token}`, "ngrok-skip-browser-warning": "69420" }
      });
      setResults(response.data.results || response.data.tracks || response.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  }, [BASE_URL, token]);

  useEffect(() => { fetchSearch(keyword); }, [keyword, fetchSearch]);

  // [핵심] Musiclist에서 토글(체크) 버튼을 눌렀을 때 실행될 함수
  const handleAddTrack = (track, isSelected) => {
    if (isSelected) {
      // 체크됨: 데이터 정규화 후 저장
      const normalized = {
        youtube_video_id: track.youtube_video_id || track.track?.youtube_video_id || track.id,
        title: track.title || track.track?.title || "Unknown Title",
        artist: track.artist || track.track?.artist || "Unknown Artist"
      };
      setPickedSong(normalized);
    } else {
      // 체크 해제됨: 선택 취소
      setPickedSong(null);
    }
  };

  const handleSelectConfirm = () => {
    if (!pickedSong) {
      alert("곡을 선택해 주세요.");
      return;
    }
    navigate("/ai_dj", { 
      state: { selectedSong: pickedSong, target: target, prevData: prevData } 
    });
  };

  return (
    <div id="Ai_Dj_Trackselect">
      <div className="container">
        <SubHeader title={"Track Select"} />
        <Searchbar value={keyword} onChange={(e) => setKeyword(e.target.value)} />

        <div className="scroll_container">
          {loading ? (
            <p style={{ textAlign: 'center', color: '#fff', marginTop: '20px' }}>Searching...</p>
          ) : (
            results.map((item, i) => (
              <Musiclist 
                key={i} 
                data={item} 
                onAdd={handleAddTrack} // 토글 이벤트 연결
              />
            ))
          )}
        </div>
        <button className="select_btn" onClick={handleSelectConfirm}>Select</button>
      </div>
      <Nav />
    </div>
  );
};

export default Ai_Dj_Trackselect;