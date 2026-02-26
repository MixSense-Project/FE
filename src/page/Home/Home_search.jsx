import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useMusic } from '../../context/MusicContext'; // 1. 추가
import searchicon from '../../assets/img/nav/search_g.svg'
import Searchedlist from '../../components/Home/Searchedlist'
import Searchlist from '../../components/Home/Searchlist'

const Home_search = () => {
  const { setCurrentTrack } = useMusic(); // 2. 전역 함수 가져오기
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
    } catch (error) { console.error(error); }
  }, [BASE_URL, token]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleTrackClick = async (e, track) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!track) return;

    setCurrentTrack(track); // 3. 클릭 시 전역 재생 곡 변경

    try {
      await axios.post(`${BASE_URL}/api/search/history`, 
        { keyword: track.title || track.keyword }, 
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      fetchHistory();
      setKeyword(""); 
    } catch (error) { console.error(error); }
  };

  const fetchSearch = async (query) => {
    if (!query.trim()) { setResults([]); return; }
    try {
      const response = await axios.get(`${BASE_URL}/api/search`, {
        params: { query, limit: 15 },
        headers: { "Authorization": `Bearer ${token}`, "ngrok-skip-browser-warning": "69420" }
      });
      setResults(response.data.results || response.data);
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
              <Searchedlist key={item.search_history_id} data={item} />
            ))
          ) : (
            results.map((item) => (
              <Searchlist 
                key={item.track_id || item.id} 
                data={item} 
                onClick={(e, data) => handleTrackClick(e, data)} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Home_search;