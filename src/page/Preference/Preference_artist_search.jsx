import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PreferenceArtistCircle from "../../components/Preference/Preference_artist_circle";
import PreferenceSelectBtn from "../../components/Preference/Preference_selectbtn";
import searchicon from "../../assets/img/nav/search_g.svg";
import { fetchArtists } from "../../api/artists";

const DEFAULT_LIMIT = 20;
const MAX_SELECT = 3;

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return debounced;
}

const Preference_artist_search = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const signupDraft = location.state?.signupDraft || null;
  const oauthUser = location.state?.oauthUser || null;

  const selectedGenres = useMemo(() => {
    return location.state?.selectedGenres ?? [];
  }, [location.state]);

  const baseSelectedIds = useMemo(() => {
    const ids = location.state?.selectedArtistIds;
    return Array.isArray(ids) ? ids : [];
  }, [location.state]);

  const baseSelectedArtists = useMemo(() => {
    const artists = location.state?.selectedArtists;
    return Array.isArray(artists) ? artists : [];
  }, [location.state]);

  const [pickedId, setPickedId] = useState("");
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 300);

  const [indexChar] = useState(null);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleArtist = (id) => {
    setPickedId((prev) => (prev === id ? "" : id));
  };

  const pickedArtist = useMemo(() => {
    if (!pickedId) return null;
    return (
      artists.find((a) => a.id === pickedId) ?? {
        id: pickedId,
        name: "",
        imageUrl: null,
      }
    );
  }, [artists, pickedId]);

  useEffect(() => {
    const keyword = debouncedQ.trim();

    if (!keyword) {
      setArtists([]);
      return;
    }

    const run = async () => {
      setLoading(true);

      try {
        const list = await fetchArtists({
          genres: selectedGenres,
          keyword,
          index_char: indexChar,
          limit: DEFAULT_LIMIT,
        });

        setArtists(list);
      } catch (e) {
        console.error("[artists search] error:", e);
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [debouncedQ, selectedGenres, indexChar]);

  const handleSelect = () => {
    if (!pickedArtist?.id) return;

    const alreadySelected = baseSelectedIds.includes(pickedArtist.id);

    let mergedIds = baseSelectedIds;
    let mergedArtists = baseSelectedArtists;

    if (!alreadySelected) {
      if (baseSelectedIds.length >= MAX_SELECT) return;

      mergedIds = [...baseSelectedIds, pickedArtist.id];
      mergedArtists = [
        ...baseSelectedArtists,
        {
          id: pickedArtist.id,
          name: pickedArtist.name,
          imageUrl: pickedArtist.imageUrl,
        },
      ];
    }

    navigate("/preference_artist", {
      state: {
        signupDraft,
        oauthUser,
        selectedGenres,
        selectedArtistIds: mergedIds,
        selectedArtists: mergedArtists,
      },
      replace: true,
    });
  };

  const handleCancel = () => {
    navigate("/preference_artist", {
      state: {
        signupDraft,
        oauthUser,
        selectedGenres,
        selectedArtistIds: baseSelectedIds,
        selectedArtists: baseSelectedArtists,
      },
      replace: true,
    });
  };

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

          <button className="cancel" onClick={handleCancel}>
            취소
          </button>
        </div>

        <div className="artist_part">
          {loading && (
            <div style={{ padding: "12px 0", color: "white" }}>
              Searching...
            </div>
          )}

          <div className="artist_grid">
            {artists.map((artist) => {
              const isAlreadySelected = baseSelectedIds.includes(artist.id);
              const isCurrentPicked = pickedId === artist.id;

              return (
                <PreferenceArtistCircle
                  key={artist.id}
                  artist={artist}
                  isSelected={isAlreadySelected || isCurrentPicked}
                  onClick={() => toggleArtist(artist.id)}
                />
              );
            })}
          </div>
        </div>

        <PreferenceSelectBtn
          disabled={
            !pickedArtist ||
            (!baseSelectedIds.includes(pickedArtist.id) &&
              baseSelectedIds.length >= MAX_SELECT)
          }
          onClick={handleSelect}
          text="Select"
        />
      </div>
    </div>
  );
};

export default Preference_artist_search;