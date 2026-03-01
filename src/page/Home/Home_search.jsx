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

  // 검색 실행 및 결과 로그 확인
  const fetchSearch = async (query) => {
    if (!query.trim()) { setResults([]); return; }
    try {
      const response = await axios.get(`${BASE_URL}/api/search`, {
        params: { query, limit: 15 },
        headers: { "Authorization": `Bearer ${token}`, "ngrok-skip-browser-warning": "69420" }
      });
      console.log("🔍 [Search API 결과]:", response.data);
      setResults(response.data.results || response.data);
    } catch (error) { console.error("검색 실패:", error); }
  };

  const handleTrackClick = async (e, track) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
        console.log("[클릭한 트랙 원본 데이터]:", track);

    if (!track) return;

    const normalizedTrack = {
      ...track,
      youtube_video_id: track.youtube_video_id || track.track?.youtube_video_id || track.video_id || track.id,
      title: track.title || track.track?.title || track.keyword || "Unknown Title",
      artist: track.artist || track.track?.artist || "Unknown Artist"
    };

    console.log("✨ [정규화된 트랙 데이터]:", normalizedTrack);

    setCurrentTrack(normalizedTrack); 

    try {
      await axios.post(`${BASE_URL}/api/search/history`, 
        { keyword: normalizedTrack.title }, 
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      fetchHistory();
    } catch (error) { console.error("히스토리 저장 실패", error); }
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