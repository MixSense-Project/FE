import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SubHeader from "../../components/SubHeader";
import PreferenceArtistCircle from "../../components/Preference/Preference_artist_circle";
import PreferenceSelectBtn from "../../components/Preference/Preference_selectbtn";
import search_white from "../../assets/img/Header/search_white.svg";
import { GENRES } from "../../data/Preference_genre";
import { signup } from "../../api/auth";

const MAX_SELECT = 20;

function buildQuery(paramsObj = {}) {
  const params = new URLSearchParams();

  Object.entries(paramsObj).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v === undefined || v === null) return;
        params.append(key, String(v));
      });
    } else {
      params.set(key, String(value));
    }
  });

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function isLikelyJwt(token) {
  return typeof token === "string" && token.split(".").length === 3;
}

async function request(path, options = {}) {
  const url = path.startsWith("/") ? path : `/${path}`;

  console.log("[API]", options.method || "GET", url);

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

  if (!res.ok) {
    console.error("[API] status:", res.status, "CT:", contentType);
    console.error("[API] body head:", text.slice(0, 500));
    throw new Error(`HTTP ${res.status} - ${text.slice(0, 200)}`);
  }

  if (!text) return null;
  if (!contentType.includes("application/json")) return text;
  return JSON.parse(text);
}

const Preference_artist = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const signupDraft = location.state?.signupDraft || null;

  const selectedGenres = useMemo(() => {
    return location.state?.selectedGenres ?? [];
  }, [location.state]);

  const genreLabelToId = useMemo(() => {
    return new Map(
      (GENRES || []).map((g) => [String(g.label).trim(), String(g.id).trim()])
    );
  }, []);

  const favoriteGenreIds = useMemo(() => {
    const ids = (selectedGenres || [])
      .map((label) => {
        if (label == null) return null;
        const key = String(label).trim();
        if (!key) return null;
        return genreLabelToId.get(key) ?? null;
      })
      .filter(Boolean);

    return Array.from(new Set(ids));
  }, [selectedGenres, genreLabelToId]);

  const genresKey = useMemo(() => {
    return (selectedGenres || []).slice().sort().join("|");
  }, [selectedGenres]);

  const [artists, setArtists] = useState([]);
  const [selected, setSelected] = useState(() => new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

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
    setSelected(new Set());
  }, [genresKey]);

  useEffect(() => {
    const incomingIds = location.state?.selectedArtistIds;
    if (!Array.isArray(incomingIds) || incomingIds.length === 0) return;

    setSelected((prev) => {
      const next = new Set(prev);
      incomingIds.forEach((id) => next.add(id));
      return next;
    });
  }, [location.state?.selectedArtistIds]);

  useEffect(() => {
    const incoming = location.state?.selectedArtist;
    if (!incoming?.id) return;

    setSelected((prev) => {
      const next = new Set(prev);
      if (!next.has(incoming.id)) {
        if (next.size >= MAX_SELECT) return next;
        next.add(incoming.id);
      }
      return next;
    });
  }, [location.state?.selectedArtist]);

  useEffect(() => {
    const fetchArtists = async () => {
      const queryGenres = selectedGenres;

      if (!queryGenres.length) {
        setArtists([]);
        return;
      }

      setLoading(true);
      setMsg("");

      try {
        const qs = buildQuery({ genres: queryGenres });
        const headers = {
          Accept: "application/json",
        };

        if (signupDraft?.token && isLikelyJwt(signupDraft.token)) {
          headers.Authorization = `Bearer ${signupDraft.token}`;
        }

        const data = await request(`/api/artists${qs}`, {
          method: "GET",
          headers,
        });

        const list = Array.isArray(data) ? data : data?.artists;

        const normalized = (Array.isArray(list) ? list : [])
          .map((a) => ({
            id: a.artist_id ?? a.artistId ?? a.id,
            name: a.name ?? a.artistName ?? a.artist_name,
            imageUrl: a.image_url ?? a.imageUrl ?? a.image ?? a.profileImageUrl,
          }))
          .filter((a) => a.id != null);

        setArtists(normalized);
      } catch (e) {
        console.error("[artists] fetch error:", e);
        setArtists([]);
        setMsg("아티스트 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [selectedGenres, signupDraft?.token]);

  const handleSubmit = async () => {
    if (!signupDraft) {
      setMsg("회원가입 정보가 없습니다. 처음부터 다시 진행해주세요.");
      navigate("/splash_signup", { replace: true });
      return;
    }

    const favorite_artists = Array.from(
      new Set(
        (selectedIds || [])
          .map((id) => (id == null ? "" : String(id).trim()))
          .filter((id) => id && id !== "undefined")
      )
    ).slice(0, MAX_SELECT);

    const favorite_genres = Array.from(
      new Set(
        (favoriteGenreIds || [])
          .map((id) => (id == null ? "" : String(id).trim()))
          .filter((id) => id && id !== "undefined")
      )
    );

    if (favorite_genres.length === 0 || favorite_artists.length === 0) {
      setMsg("장르와 아티스트를 선택해주세요.");
      return;
    }

    setSaving(true);
    setMsg("");

    try {
      const signupRes = await signup({
        email: signupDraft.email,
        password: signupDraft.password,
        username: signupDraft.username,
        token: signupDraft.token,
      });

      const accessToken =
        signupRes?.session?.access_token ||
        signupRes?.access_token ||
        signupDraft.token ||
        "";

      const refreshToken =
        signupRes?.session?.refresh_token ||
        signupRes?.refresh_token ||
        "";

      const userId =
        signupRes?.session?.user?.id ||
        signupRes?.user?.id ||
        "";

      if (!isLikelyJwt(accessToken)) {
        throw new Error("회원가입 후 access token을 받지 못했습니다.");
      }

      localStorage.setItem("access_token", accessToken);
      if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
      if (userId) localStorage.setItem("user_id", userId);
      if (signupDraft.username) localStorage.setItem("username", signupDraft.username);
      if (signupDraft.email) localStorage.setItem("email", signupDraft.email);

      const payload = { favorite_genres, favorite_artists };
      console.log("[profile/preferences] payload:", payload);

      await request("/api/profile/preferences", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      navigate("/splash_login", {
        replace: true,
        state: {
          prefillEmail: signupDraft.email,
        },
      });
    } catch (e) {
      console.error("[signup + preferences] error:", e);
      setMsg("회원가입 또는 선호 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="artist_wrap">
      <div className="container">
        <SubHeader
          title="Artist"
          bgColor="var(--black)"
          rightIcon={search_white}
          rightAlt="search"
          onRightClick={() =>
            navigate("/preference_artist_search", {
              state: {
                signupDraft,
                selectedGenres,
                selectedArtistIds: selectedIds,
              },
            })
          }
        />

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
          {loading && (
            <div style={{ padding: "12px 0", color: "white" }}>Loading...</div>
          )}

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
        </div>

        {msg && (
          <p style={{ color: "white", marginTop: 12, textAlign: "center" }}>
            {msg}
          </p>
        )}

        <PreferenceSelectBtn
          disabled={selected.size === 0 || saving}
          onClick={handleSubmit}
          text={saving ? "Saving..." : "Select"}
        />
      </div>
    </div>
  );
};

export default Preference_artist;