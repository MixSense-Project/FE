import React, { useState, useEffect, useCallback, useRef } from 'react';
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

  const [playingId, setPlayingId] = useState(null);
  
  // 🔥 핵심: 오디오 객체를 딱 하나만 만들어서 계속 재사용합니다.
  const audioRef = useRef(new Audio()); 
  const isFetchingRef = useRef(false);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('access_token');

  // 오디오 정지 및 초기화
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ""; 
      // load를 해줘야 네트워크 연결이 확실히 끊깁니다.
      audioRef.current.load(); 
    }
    setPlayingId(null);
    isFetchingRef.current = false;
  };

  const fetchSourceTracks = useCallback(async (query) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/ai/mix/source-tracks`, {
        params: { keyword: query, limit: 15 },
        headers: { 
          "Authorization": `Bearer ${token}`, 
          "ngrok-skip-browser-warning": "69420" 
        }
      });
      setResults(response.data.source_tracks || []);
    } catch (error) { 
      console.error("Data load failed:", error); 
    } finally { 
      setLoading(false); 
    }
  }, [BASE_URL, token]);

  useEffect(() => { 
    fetchSourceTracks(keyword); 
    // 페이지를 떠날 때 오디오 정리
    return () => stopAudio(); 
  }, [keyword, fetchSourceTracks]);

  const handlePreviewToggle = async (trackId) => {
    // 1. 같은 곡이면 정지
    if (playingId === trackId) {
      stopAudio();
      return;
    }

    // 2. 다른 곡 재생 시 중복 요청 방지
    if (isFetchingRef.current) return;

    try {
      // 재생 시도 전 기존 소리 정지
      stopAudio(); 
      isFetchingRef.current = true;

      const response = await axios.get(`${BASE_URL}/api/ai/mix/source-tracks/${trackId}/preview`, {
        params: { duration_sec: 30 },
        headers: { 
          "Authorization": `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420" 
        }
      });

      const audioUrl = response.data.preview_audio_url;

      // API 응답이 왔을 때 사용자가 이미 정지 버튼을 눌렀다면 무시
      if (!isFetchingRef.current) return;

      if (audioUrl) {
        console.log("재생 시도:", audioUrl);
        
        // 🔥 객체를 새로 만들지 않고 기존 객체의 주소만 바꿉니다. (가장 안정적)
        audioRef.current.src = audioUrl;
        audioRef.current.crossOrigin = "anonymous";
        
        setPlayingId(trackId);

        // 재생 시도
        audioRef.current.play().catch(e => {
          console.error("재생 실패:", e);
          // 실패 시 상태 초기화
          setPlayingId(null);
        });

        audioRef.current.onended = () => {
          setPlayingId(null);
        };
      } else {
        alert("미리듣기 주소를 찾을 수 없습니다.");
        isFetchingRef.current = false;
      }
    } catch (error) {
      console.error("API Error:", error);
      isFetchingRef.current = false;
    }
  };

  const handleItemClick = (item) => {
    if (!item) return;
    
    setPickedSong({
      id: item.mix_track_id, 
      title: item.title,
      bpm: item.bpm_hint,
      thumbnail: item.thumbnail 
    });

    handlePreviewToggle(item.mix_track_id);
  };

  return (
    <div id="Ai_Dj_Trackselect">
      <div className="container">
        <SubHeader title={"Track Select"} />
        <Searchbar value={keyword} onChange={(e) => setKeyword(e.target.value)} />

        <div className="scroll_container">
          {loading ? (
            <p style={{ textAlign: 'center', color: '#fff' }}>Loading...</p>
          ) : (
            results.map((item) => {
              const isSelected = pickedSong?.id === item.mix_track_id;
              const isPlaying = playingId === item.mix_track_id;

              return (
                <div 
                  key={item.mix_track_id} 
                  onClick={() => handleItemClick(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <Musiclist 
                    data={item} 
                    isSelected={isSelected}
                    isPlaying={isPlaying} 
                    onAdd={(data, selected) => {
                      if(selected) setPickedSong({ id: data.mix_track_id, title: data.title });
                      else setPickedSong(null);
                    }}
                  />
                </div>
              );
            })
          )}
        </div>
        
        <button className="select_btn" onClick={() => {
          if (!pickedSong) return alert("곡을 선택해 주세요.");
          stopAudio();
          navigate("/ai_dj", { state: { selectedSong: pickedSong, target, prevData } });
        }}>
          Select
        </button>
      </div>
      <Nav />
    </div>
  );
};

export default Ai_Dj_Trackselect;