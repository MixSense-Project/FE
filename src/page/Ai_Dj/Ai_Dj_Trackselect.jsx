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

  const handleAddTrack = (track, shouldSelect) => {
    if (shouldSelect) {
      const normalized = {
        id: track.mix_track_id, 
        title: track.title || "Unknown Title",
        artist: track.artist || "MixSense Source",
        bpm: track.bpm_hint,
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
              results.map((item, i) => {
                const isSelected = pickedSong?.id === item.mix_track_id;

                return (
                  <Musiclist 
                    key={item.mix_track_id || i} 
                    data={item} 
                    onAdd={handleAddTrack}
                    isSelected={isSelected} 
                  />
                );
              })
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