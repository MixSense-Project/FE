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
  const [pickedSong, setPickedSong] = useState(null); 

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('access_token');

  // [수정] 성연님의 응답 구조 { "source_tracks": [...] } 반영
  const fetchSourceTracks = useCallback(async (query) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/ai/mix/source-tracks`, {
        params: { 
          keyword: query, 
          limit: 15 
        },
        headers: { 
          "Authorization": `Bearer ${token}`, 
          "ngrok-skip-browser-warning": "69420" 
        }
      });

      // 데이터가 source_tracks 안에 들어있으므로 해당 배열을 추출
      const tracks = response.data.source_tracks || [];
      setResults(tracks);
    } catch (error) { 
      console.error("Source tracks load failed:", error); 
    } finally { 
      setLoading(false); 
    }
  }, [BASE_URL, token]);

  useEffect(() => { 
    fetchSourceTracks(keyword); 
  }, [keyword, fetchSourceTracks]);

  // [수정] mix_track_id를 id로 정규화하여 저장
  const handleAddTrack = (track, isSelected) => {
    if (isSelected) {
      const normalized = {
        // 서버에서 주는 고유 ID 필드명: mix_track_id
        id: track.mix_track_id, 
        title: track.title || "Unknown Title",
        // 현재 데이터에 artist가 없으므로 기본값 처리 (필요시 track.artist 등으로 변경)
        artist: track.artist || "MixSense Source",
        bpm: track.bpm_hint,
        // thumbnail이 없는 경우를 대비한 처리
        thumbnail: track.thumbnail || "" 
      };
      setPickedSong(normalized);
      console.log("선택된 곡:", normalized);
    } else {
      setPickedSong(null);
    }
  };

  const handleSelectConfirm = () => {
    if (!pickedSong) {
      alert("곡을 선택해 주세요.");
      return;
    }
    // 선택된 곡을 들고 Ai_Dj 메인 페이지로 복귀
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
            <p style={{ textAlign: 'center', color: '#fff', marginTop: '20px' }}>Loading Tracks...</p>
          ) : (
            results.length > 0 ? (
              results.map((item, i) => (
                <Musiclist 
                  key={item.mix_track_id || i} 
                  data={item} 
                  onAdd={handleAddTrack} 
                />
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>
                No mixable tracks found.
              </p>
            )
          )}
        </div>
        <button className="select_btn" onClick={handleSelectConfirm}>Select</button>
      </div>
      <Nav />
    </div>
  );
};

export default Ai_Dj_Trackselect;