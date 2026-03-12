import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useMusic } from '../../context/MusicContext'; 
import searchicon from '../../assets/img/nav/search_g.svg';
import Searchedlist from '../../components/Home/Searchedlist';
import Searchlist from '../../components/Home/Searchlist';
import Nav from '../../components/Nav';

const Home_search = () => {
  const { setCurrentTrack } = useMusic(); 
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]); 

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('access_token');

  const fetchHistory = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/search/history`, {
        params: { limit: 10 },
        headers: { "Authorization": `Bearer ${token}`, "ngrok-skip-browser-warning": "69420" }
      });
      setHistory(response.data.history || []);
    } catch (error) { console.error("히스토리 로딩 실패:", error); }
  }, [BASE_URL, token]);

  useEffect(() => { if(token) fetchHistory(); }, [fetchHistory, token]);

  const fetchSearch = async (query) => {
    if (!query.trim()) { setResults([]); return; }
    try {
      const response = await axios.get(`${BASE_URL}/api/search`, {
        params: { query, limit: 15 },
        headers: { "Authorization": `Bearer ${token}`, "ngrok-skip-browser-warning": "69420" }
      });
      setResults(response.data.results || response.data);
    } catch (error) { console.error("검색 실패:", error); }
  };

  const handleTrackClick = async (e, track) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!track) return;

    // 1. 데이터 정규화
    const trackTitle = track.title || track.track?.title || track.keyword;
    const trackVideoId = track.youtube_video_id || track.track?.youtube_video_id || track.video_id || track.id;

    const normalizedTrack = {
      ...track,
      youtube_video_id: trackVideoId,
      title: trackTitle || "Unknown Title",
      artist: track.artist || track.track?.artist || "Unknown Artist"
    };

    // 2. 음악 재생 설정
    setCurrentTrack(normalizedTrack); 

    try {
      // --- 중복 방지 로직 시작 ---
      // 현재 기록(history) 중에 클릭한 곡과 같은 비디오 ID를 가진 항목이 있는지 확인
      const existingItem = history.find(item => {
        const itemVideoId = item.youtube_video_id || item.track?.youtube_video_id;
        return itemVideoId === trackVideoId;
      });

      // 만약 이미 기록에 있다면, 서버에서 기존 기록 삭제 (순서 최신화를 위해)
      if (existingItem && existingItem.search_history_id) {
        await axios.delete(`${BASE_URL}/api/search/history/${existingItem.search_history_id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
      }

      // 3. 새로 기록 등록 (이렇게 하면 서버 DB 상에서도 가장 최신 순서로 저장됨)
      await axios.post(`${BASE_URL}/api/search/history`, 
        { keyword: normalizedTrack.title }, 
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      
      // 4. 히스토리 다시 불러와서 UI 업데이트
      fetchHistory();
      // --- 중복 방지 로직 끝 ---

    } catch (error) { 
      console.error("히스토리 처리 실패", error); 
    }
  };

  const handleDeleteHistory = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/search/history/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchHistory();
    } catch (error) { console.error(error); }
  };

  return (
    <div className="home_search_wrap">
      <div className="container">
        <div className="search">
          <div className="searchbar">
            <img src={searchicon} alt="" />
            <input 
              type="text" 
              placeholder='Search' 
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                fetchSearch(e.target.value);
              }}
            />
          </div>
          <Link to='/home'><p>취소</p></Link>
        </div>

        <div className="scroll_container">
          {keyword === "" ? (
            history.map((item) => (
              <Searchedlist 
                key={item.search_history_id} 
                data={item} 
                onClick={(e) => handleTrackClick(e, item)} 
                onDelete={handleDeleteHistory}
              />
            ))
          ) : (
            results.map((item, idx) => (
              <Searchlist 
                key={item.track_id || idx} 
                data={item} 
                onPlay={(e) => handleTrackClick(e, item)} 
              />
            ))
          )}
        </div>
      </div>
      <Nav />
    </div>
  );
};

export default Home_search;