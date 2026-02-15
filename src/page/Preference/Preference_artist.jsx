import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubHeader from "../../components/SubHeader";
import PreferenceArtistCircle from "../../components/Preference/Preference_artist_circle";
import PreferenceSelectBtn from "../../components/Preference/Preference_selectbtn";

const MAX_SELECT = 20;

const Preference_artist = () => {
  const navigate = useNavigate();

  // 이전 페이지에서 받아오기
  const selectedGenres = useMemo(() => ["Pop", "Indie Pop", "Hip Hop"], []);

  const [artists, setArtists] = useState([]);
  const [selected, setSelected] = useState(() => new Set());

  //여러명 선택(최대 20) 
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

  const handleSubmit = async () => {
  if (selectedIds.length === 0) return;

  try {
    await fetch("/api/preferences/artist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ artistIds: selectedIds }),
    });

    navigate("/home"); 
  } catch (e) {
    console.error(e);
  }
};


  return (
    <div className="artist_wrap">
      <div className="container">
        <SubHeader title="Artist" bgColor="var(--black)" />

        <div className="pref_detail">
          <h1>What is your preference?</h1>
          <p>Choose your favorite genre and artist</p>
        </div>

        <div className="selected_genre">
          {selectedGenres.map((g) => (
            <div className="sg" key={g}>
              <p>{g}</p>
            </div>
          ))}
        </div>

        <div className="artist_part">
          <div className="artist_grid">
            {artists.map((artist) => (
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
            onClick={handleSubmit}
            text="Select"
          />
        </div>
      </div>
    </div>
  );
};

export default Preference_artist;
