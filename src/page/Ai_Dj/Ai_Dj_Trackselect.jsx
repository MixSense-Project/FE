import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Nav from '../../components/Nav';
import SubHeader from '../../components/SubHeader';
import Searchbar from '../../components/Home/Searchbar';
import Musiclist from '../../components/Home/Musiclist';
import musicplaying_icon from '../../assets/img/home/musicplaying_icon.svg'

const Ai_Dj_Trackselect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { target, prevData } = location.state || {}; 

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pickedSong, setPickedSong] = useState(null); 

  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(null);
  const isFetchingRef = useRef(false); // API 중복 호출 방지용

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('access_token');

  // 오디오 정지 함수: 현재 소리를 완전히 죽이고 리소스를 해제함
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ""; 
      audioRef.current.load(); // 메모리에서 소스 해제
      audioRef.current = null;
    }
    setPlayingId(null);
    isFetchingRef.current = false;
    console.log("오디오 완전 정지 및 리셋");
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
      console.error("데이터 로드 실패:", error); 
    } finally { 
      setLoading(false); 
    }
  }, [BASE_URL, token]);

  useEffect(() => { 
    fetchSourceTracks(keyword); 
    return () => stopAudio(); 
  }, [keyword, fetchSourceTracks]);

  // 토글 정지 핵심 로직
  const handlePreviewToggle = async (trackId) => {
    // 1. 재생 중인 곡을 다시 누르면 즉시 정지
    if (playingId === trackId) {
      console.log("동일 곡 클릭: 정지 실행");
      stopAudio();
      return;
    }

    // 2. 이미 로딩 중이면 중복 클릭 방지
    if (isFetchingRef.current) return;

    try {
      stopAudio(); // 다른 곡 재생 전 기존 오디오 정리
      isFetchingRef.current = true;

      const response = await axios.get(`${BASE_URL}/api/ai/mix/source-tracks/${trackId}/preview`, {
        params: { duration_sec: 30 },
        headers: { 
          "Authorization": `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420" 
        }
      });

      const audioUrl = response.data.preview_audio_url;

      // 만약 API 응답이 왔을 때 사용자가 이미 다른걸 눌러서 멈춘 상태라면 실행 안함
      if (!isFetchingRef.current) return;

      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        setPlayingId(trackId);

        audio.play().catch(e => console.error("Play Error:", e));
        audio.onended = () => stopAudio();
      } else {
        alert("미리듣기 주소를 찾을 수 없습니다.");
        isFetchingRef.current = false;
      }
    } catch (error) {
      console.error("API Error:", error);
      isFetchingRef.current = false;
    }
  };

  const handleItemClick = (track) => {
    if (!track) return;
    
    // 아티스트 필드 제외하고 곡 정보 저장
    setPickedSong({
      id: track.mix_track_id, 
      title: track.title || "No Title",
      bpm: track.bpm_hint,
      thumbnail: track.thumbnail || "" 
    });

    handlePreviewToggle(track.mix_track_id);
  };

  return (
    <div id="Ai_Dj_Trackselect">
      <div className="container">
        <SubHeader title={"Track Select"} />
        <Searchbar value={keyword} onChange={(e) => setKeyword(e.target.value)} />

        <div className="scroll_container">
          {loading ? (
            <p style={{ textAlign: 'center', color: '#fff', marginTop: '20px' }}>Loading...</p>
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
                    data={item} // 아티스트 필드 제외하고 전달
                    onAdd={() => {}} 
                    isSelected={isSelected}
                    isPlaying={isPlaying} 
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