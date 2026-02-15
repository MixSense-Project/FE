import React, { useMemo, useState } from "react";
import SubHeader from "../../components/SubHeader";
import PreferenceGenreCircle from "../../components/Preference/Preference_genre_circle";
import PreferenceSelectBtn from "../../components/Preference/Preference_selectbtn";
import { GENRES } from "../../data/Preference_genre";

const MAX_SELECT = 20;

const Preference_genre = () => {
  const [selected, setSelected] = useState(() => new Set());

  const toggleGenre = (id) => {
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

  const handleSubmit = () => {
    console.log("selected:", selectedIds);
  };

  return (
    <div className="genre_wrap">
      <div className="container">
        <SubHeader title="Genre" bgColor="var(--black)" />

        <div className="pref_detail">
          <h1>What is your preference?</h1>
          <p>Choose your favorite genre and artist</p>
        </div>

        <div className="genre_part">
          <div className="genre_grid">
            {GENRES.map((g) => (
              <PreferenceGenreCircle
                key={g.id}
                label={g.label}
                image={g.image}
                selected={selected.has(g.id)}
                onClick={() => toggleGenre(g.id)}
              />
            ))}
          </div>

        <PreferenceSelectBtn
          disabled={selected.size === 0}
          onClick={handleSubmit}
          text="Select"
        /></div>
      </div>
    </div>
  );
};

export default Preference_genre;
