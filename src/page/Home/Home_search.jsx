import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Nav from '../../components/Nav'
import searchicon from '../../assets/img/nav/search_g.svg'
import Musicplay from '../../components/Home/Musicplay'
import Searchedlist from '../../components/Home/Searchedlist'
import Searchlist from '../../components/Home/Searchlist'

const Home_search = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]); 
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('access_token');

  // 히스토리 가져오기
  const fetchHistory = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/search/history`, {
        params: { limit: 10 },
        headers: {
          "Authorization": `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420"
        }
      });
      const data = response.data.history || [];
      setHistory(data);
      console.log("📡 히스토리 데이터 로드 완료:", data.length);
    } catch (error) {
      console.error("히스토리 로드 실패:", error);
    }
  }, [BASE_URL, token]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // 검색 결과 클릭 시 히스토리 저장 및 화면 전환
  const handleTrackClick = async (e, track) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!track) return;
    const titleToSave = track.title || track.keyword;

    try {
      console.log("🛠️ [1/3] 서버 저장 시작:", titleToSave);

      const res = await axios.post(`${BASE_URL}/api/search/history`, 
        { keyword: titleToSave }, 
        { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      if (res.status === 201 || res.status === 200) {
        console.log("✅ [2/3] 서버 저장 완료");
        await fetchHistory(); 
        console.log("🚀 [3/3] 검색창 초기화");
        setKeyword(""); 
      }
    } catch (error) {
      console.error("❌ 저장 오류:", error);
    }
  };

  // 검색 API 호출
  const fetchSearch = async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/search`, {
        params: { query: query, limit: 15 },
        headers: { "Authorization": `Bearer ${token}`, "ngrok-skip-browser-warning": "69420" }
      });
      setResults(response.data.results || response.data);
    } catch (error) {
      console.error("검색 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  // 개별 히스토리 삭제 로직
  const handleDeleteHistory = async (id) => {
    try {
      console.log(`🗑️ 삭제 요청 ID: ${id}`);
      await axios.delete(`${BASE_URL}/api/search/history/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      // 삭제 후 목록 새로고침
      fetchHistory();
    } catch (error) {
      console.error("❌ 삭제 실패:", error);
    }
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
          <Link to='/home'>
            <p onClick={() => { setKeyword(""); fetchHistory(); }}>취소</p>
          </Link>
        </div>

        <div className="scroll_container">
          {keyword === "" ? (
            <>
              <p className='history'>History</p>
              {history.length > 0 ? (
                history.map((item) => (
                  <Searchedlist 
                    key={item.search_history_id} 
                    data={item} 
                    onDelete={handleDeleteHistory} 
                  />
                ))
              ) : (
                <p style={{textAlign:'center', color:'#888', marginTop:'40px'}}>기록 없음</p>
              )}
            </>
          ) : (
            <div className="search_results">
              {loading ? (
                <p style={{textAlign:'center', marginTop:'20px'}}>Searching...</p>
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
          )}
        </div>
        <Musicplay />
      </div>
      <Nav />
    </div>
  )
}

export default Home_search;