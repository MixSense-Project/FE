import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PreferenceArtistCircle from "../../components/Preference/Preference_artist_circle";
import PreferenceSelectBtn from "../../components/Preference/Preference_selectbtn";
import searchicon from "../../assets/img/Nav/search_g.svg";

const MAX_SELECT = 20;

const Preference_artist_search = () => {
  const navigate = useNavigate();

  // 여기서는 장르를 어떻게 받을지에 따라 바뀜
  const selectedGenres = useMemo(() => ["Pop", "Indie Pop", "Hip Hop"], []);

  const [artists, setArtists] = useState([]);
  const [selected, setSelected] = useState(() => new Set());
  const [q, setQ] = useState("");

  const toggleArtist = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        if (next.size >= MAX_SELECT) return next;
        next.add(id);
      }
      return next;
    });
  };

  const selectedIds = useMemo(() => Array.from(selected), [selected]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const qs = encodeURIComponent(selectedGenres.join(","));
        const res = await fetch(`/api/artists?genres=${qs}`);
        if (!res.ok) throw new Error("Failed to fetch artists");
        const data = await res.json();
        setArtists(data);
      } catch (e) {
        console.error(e);
        setArtists([]);
      }
    };
    fetchArtists();
  }, [selectedGenres]);

  // 검색어로 필터
  const filteredArtists = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return artists;
    return artists.filter((a) =>
      (a.name ?? "").toLowerCase().includes(keyword)
    );
  }, [artists, q]);

  return (
    <div className="pre_art_search_wrap">
      <div className="container">
        <div className="search_header">
          <div className="pre_searchbar">
            <div className="searchbar_content">
              <img src={searchicon} alt="Search Icon" />
              <input
                type="text"
                placeholder="Search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>

          <button className="cancel" onClick={() => navigate("/preference_artist")}>
            취소
          </button>
        </div>

        <div className="artist_part">
          <div className="artist_grid">
            {filteredArtists.map((artist) => (
              <PreferenceArtistCircle
                key={artist.id}
                artist={artist}
                isSelected={selected.has(artist.id)}
                onClick={() => toggleArtist(artist.id)}
              />
            ))}
          </div>

          <PreferenceSelectBtn
            disabled={selected.size === 0}
            onClick={() => {
              console.log("selected:", selectedIds);
              // 필요하면 여기서 POST하고 다음 화면 이동
            }}
            text="Select"
          />
        </div>
      </div>
    </div>
  );
};

export default Preference_artist_search;
