import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PreferenceArtistCircle from "../../components/Preference/Preference_artist_circle";
import PreferenceSelectBtn from "../../components/Preference/Preference_selectbtn";
import searchicon from "../../assets/img/nav/search_g.svg";

const DEFAULT_LIMIT = 20;

function buildQuery(paramsObj = {}) {
  const params = new URLSearchParams();

  Object.entries(paramsObj).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v === undefined || v === null) return;
        const s = String(v).trim();
        if (!s) return;
        params.append(key, s);
      });
    } else {
      const s = String(value).trim();
      if (!s) return;
      params.set(key, s);
    }
  });

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

async function requestJson(path, options = {}) {
  const url = `${path.startsWith("/") ? "" : "/"}${path}`; 
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!res.ok) throw new Error(`HTTP ${res.status} - ${text.slice(0, 200)}`);

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Non-JSON response (${contentType}). Body head: ${text.slice(0, 120)}`
    );
  }

  return text ? JSON.parse(text) : null;
}

function pickImage(a) {
  if (Array.isArray(a?.images) && a.images.length > 0) {
    const first = a.images[0];
    return typeof first === "string" ? first : first?.url;
  }
  return (
    a.imageUrl ??
    a.image_url ??
    a.image ??
    a.profileImageUrl ??
    a.profile_image_url ??
    a.thumbnail ??
    a.thumbnailUrl ??
    null
  );
}

function normalizeArtists(payload) {
  const list = Array.isArray(payload)
    ? payload
    : payload?.artists ??
    payload?.items ??
    payload?.results ??
    payload?.data ??
    payload?.artists?.items;

  return (Array.isArray(list) ? list : []).map((a, idx) => {
    const rawId =
      a.id ??
      a.artistId ??
      a.artist_id ??
      a.spotifyId ??
      a.spotify_id ??
      a.artistID ??
      null;

    const name =
      a.name ?? a.artistName ?? a.artist_name ?? a.title ?? a.artist ?? "";

    const id = rawId ?? `${name || "artist"}__${idx}`;

    return { id, name, imageUrl: pickImage(a) };
  });
}

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

  const selectedGenres = useMemo(() => {
    return location.state?.selectedGenres ?? [];
  }, [location.state]);

  const baseSelectedIds = useMemo(() => {
    const ids = location.state?.selectedArtistIds;
    return Array.isArray(ids) ? ids : [];
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
        const qs = buildQuery({
          genres: selectedGenres, 
          keyword,
          index_char: indexChar,
        });

        const data = await requestJson(`/api/artists${qs}`, { method: "GET" });

        const normalized = normalizeArtists(data).slice(0, DEFAULT_LIMIT);
        setArtists(normalized);
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

    const mergedIds = Array.from(new Set([...baseSelectedIds, pickedArtist.id]));

    navigate("/preference_artist", {
      state: {
        selectedGenres,
        selectedArtist: pickedArtist,
        selectedArtistIds: mergedIds,
      },
      replace: true,
    });
  };

  const handleCancel = () => {
    navigate("/preference_artist", {
      state: {
        selectedGenres,
        selectedArtistIds: baseSelectedIds,
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
            {artists.map((artist) => (
              <PreferenceArtistCircle
                key={artist.id}
                artist={artist}
                isSelected={
                  baseSelectedIds.includes(artist.id) || pickedId === artist.id
                }
                onClick={() => toggleArtist(artist.id)}
              />
            ))}
          </div> </div>

        <PreferenceSelectBtn
          disabled={!pickedArtist}
          onClick={handleSelect}
          text="Select"
        />

      </div>
    </div>
  );
};

export default Preference_artist_search;