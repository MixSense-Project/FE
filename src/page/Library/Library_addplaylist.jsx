import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Nav from "../../components/Nav";
import SubHeader from "../../components/SubHeader";
import searchicon from "../../assets/img/nav/search_g.svg";
import Library_searchlist from "../../components/Library/Library_searchlist";

import { addTrackToPlaylist } from "../../api/playlists";

const Library_addplaylist = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const playlistId = location.state?.playlistId || null;
  const playlistTitle = location.state?.playlistTitle || "myplaylist";
  const headerTitle = useMemo(() => `Add to '${playlistTitle}'`, [playlistTitle]);

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  const [addedTracks, setAddedTracks] = useState([]);
  const [addingIds, setAddingIds] = useState(() => new Set());

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("access_token");

  const STORAGE_KEY = useMemo(() => {
    return playlistId ? `playlist_added_${playlistId}` : null;
  }, [playlistId]);

  useEffect(() => {
    if (!STORAGE_KEY) return;
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) setAddedTracks(parsed);
    } catch {
    }
  }, [STORAGE_KEY]);

  useEffect(() => {
    if (!STORAGE_KEY) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(addedTracks));
  }, [STORAGE_KEY, addedTracks]);

  const fetchSearch = async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/search`, {
        params: { query, limit: 15 },
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      setResults(response.data.results || response.data || []);
    } catch (error) {
      console.error("라이브러리 검색 실패:", error);
      setResults([]);
    }
  };

  const handleAddToggle = async (e, track, nextIsAdd) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!playlistId) {
      alert("플레이리스트 정보가 없어. 이전 화면에서 다시 진입해줘.");
      return;
    }

    const trackId = track?.track_id || track?.id;
    if (!trackId) {
      alert("track_id가 없어 추가할 수 없어. 검색 응답에 track_id가 있는지 확인해줘.");
      return;
    }

    if (!nextIsAdd) {
      setAddedTracks((prev) => prev.filter((t) => (t?.track_id || t?.id) !== trackId));
      return;
    }

    if (!track?.youtube_video_id) {
      alert("이 곡은 YouTube 영상이 매핑되지 않아 추가할 수 없어.");
      return;
    }

    if (addingIds.has(trackId)) return;
    setAddingIds((prev) => {
      const next = new Set(prev);
      next.add(trackId);
      return next;
    });

    try {
      await addTrackToPlaylist({ playlistId, track });

      setAddedTracks((prev) => {
        const exists = prev.some((t) => (t?.track_id || t?.id) === trackId);
        if (exists) return prev;
        return [track, ...prev];
      });
    } catch (err) {
      console.error("플레이리스트 곡 추가 실패:", err);
      alert(err?.message || "곡 추가에 실패했어.");
    } finally {
      setAddingIds((prev) => {
        const next = new Set(prev);
        next.delete(trackId);
        return next;
      });
    }
  };

  const goBackToPlaylist = () => {
    if (!playlistId) {
      navigate(-1);
      return;
    }

    navigate(`/library/playlist?id=${playlistId}`, {
      replace: true,
      state: {
        id: playlistId,
        title: playlistTitle,
        addedTracks, 
      },
    });
  };

  return (
    <div className="libraryaddplaylist_wrap">
      <div className="container">
        <SubHeader title={headerTitle} />

        <div className="lb_add_search">
          <div id="Searchbar_Wrap">
            <div className="searchbar">
              <div className="searchbar_content">
                <img src={searchicon} alt="Search Icon" />
                <input
                  type="text"
                  placeholder="Search"
                  value={keyword}
                  onChange={(e) => {
                    const v = e.target.value;
                    setKeyword(v);
                    fetchSearch(v);
                  }}
                />
              </div>
            </div>
          </div>

          <button type="button" onClick={goBackToPlaylist} style={{ marginTop: 8 }}>
            완료
          </button>
        </div>

        <div className="lb_add_main">
          <div className="scroll_container">
            {results.map((item, idx) => (
              <Library_searchlist
                key={item.track_id || item.id || idx}
                data={item}
                onClick={() => {}}
                onAdd={handleAddToggle}
              />
            ))}
          </div>
        </div>
      </div>

      <Nav />
    </div>
  );
};

export default Library_addplaylist;