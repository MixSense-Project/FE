import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SubHeader from "../../components/SubHeader";
import PreferenceArtistCircle from "../../components/Preference/Preference_artist_circle";
import PreferenceSelectBtn from "../../components/Preference/Preference_selectbtn";
import search_white from "../../assets/img/Header/search_white.svg";
import { GENRES } from "../../data/Preference_genre";
import { signup } from "../../api/auth";
import { apiRequest } from "../../api/http";
import { fetchArtists } from "../../api/artists";

const MAX_SELECT = 20;

function isLikelyJwt(token) {
  return typeof token === "string" && token.split(".").length === 3;
}

const Preference_artist = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const signupDraft = location.state?.signupDraft || null;
  const oauthUser = location.state?.oauthUser || null;

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

  useEffect(() => {
    setSelected(new Set());
  }, [genresKey]);

  useEffect(() => {
    const incomingIds = location.state?.selectedArtistIds;
    if (!Array.isArray(incomingIds) || incomingIds.length === 0) return;

    setSelected((prev) => {
      const next = new Set(prev);
      incomingIds.forEach((id) => {
        if (next.size < MAX_SELECT) next.add(id);
      });
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
    const run = async () => {
      if (!selectedGenres.length) {
        setArtists([]);
        return;
      }

      setLoading(true);
      setMsg("");

      try {
        const token =
          signupDraft?.token && isLikelyJwt(signupDraft.token)
            ? signupDraft.token
            : undefined;

        const list = await fetchArtists({
          genres: selectedGenres,
          token,
        });

        setArtists(list);

        if (list.length === 0) {
          setMsg("표시할 아티스트가 없습니다.");
        }
      } catch (e) {
        console.error("[artists] fetch error:", e);
        setArtists([]);
        setMsg("아티스트 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [selectedGenres, signupDraft?.token]);

  const handleSubmit = async () => {
    const hasSignupDraft = !!signupDraft;
    const hasOauthUser = !!oauthUser;

    if (!hasSignupDraft && !hasOauthUser) {
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
      const payload = { favorite_genres, favorite_artists };
      console.log("[profile/preferences] payload:", payload);

      // 1) 이메일 회원가입 흐름
      if (hasSignupDraft) {
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
          signupRes?.session?.refresh_token || signupRes?.refresh_token || "";

        const userId =
          signupRes?.session?.user?.id || signupRes?.user?.id || "";

        if (!isLikelyJwt(accessToken)) {
          throw new Error("회원가입 후 access token을 받지 못했습니다.");
        }

        localStorage.setItem("access_token", accessToken);
        if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
        if (userId) localStorage.setItem("user_id", userId);
        if (signupDraft.username) {
          localStorage.setItem("username", signupDraft.username);
        }
        if (signupDraft.email) {
          localStorage.setItem("email", signupDraft.email);
        }

        await apiRequest("/api/profile/preferences", {
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

        return;
      }

      // 2) 구글 로그인 흐름
      if (hasOauthUser) {
        const accessToken = localStorage.getItem("access_token") || "";

        if (!isLikelyJwt(accessToken)) {
          throw new Error("구글 로그인 토큰이 없습니다.");
        }

        if (oauthUser?.id) {
          localStorage.setItem("user_id", oauthUser.id);
        }
        if (oauthUser?.username) {
          localStorage.setItem("username", oauthUser.username);
        }
        if (oauthUser?.email) {
          localStorage.setItem("email", oauthUser.email);
        }

        await apiRequest("/api/profile/preferences", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        navigate("/home", { replace: true });
      }
    } catch (e) {
      console.error("[signup/preferences] error:", e);
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
                oauthUser,
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