import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SubHeader from "../../components/SubHeader";
import PreferenceGenreCircle from "../../components/Preference/Preference_genre_circle";
import PreferenceSelectBtn from "../../components/Preference/Preference_selectbtn";
import { GENRES } from "../../data/Preference_genre";

const MAX_SELECT = 3;

const Preference_genre = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const signupDraft = location.state?.signupDraft || null;
  const [selected, setSelected] = useState(() => new Set());

  const toggleGenre = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= MAX_SELECT) return next;
        next.add(id);
      }

      return next;
    });
  };

  const selectedIds = useMemo(() => Array.from(selected), [selected]);

  const selectedGenreLabels = useMemo(() => {
    return GENRES.filter((g) => selected.has(g.id)).map((g) => g.label);
  }, [selected]);

  const handleSubmit = () => {
    if (!signupDraft) {
      navigate("/splash_signup", { replace: true });
      return;
    }

    navigate("/preference_artist", {
      state: {
        signupDraft,
        selectedGenres: selectedGenreLabels,
        selectedArtistIds: [],
      },
    });
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
          />
        </div>
      </div>
    </div>
  );
};

export default Preference_genre;