import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Nav from "../../components/Nav";
import SubHeader from "../../components/SubHeader";
import searchicon from "../../assets/img/nav/search_g.svg";
import Library_searchlist from "../../components/Library/Library_searchlist";

import { addTrackToPlaylist } from "../../api/playlists";
import { api } from "../../api/client";

const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "69420",
  Accept: "application/json",
};

const Library_addplaylist = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const playlistId = location.state?.playlistId || null;
  const playlistTitle = location.state?.playlistTitle || "myplaylist";
  const headerTitle = useMemo(
    () => `Add to '${playlistTitle}'`,
    [playlistTitle]
  );

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(false);

  const [addedTracks, setAddedTracks] = useState([]);
  const [addingIds, setAddingIds] = useState(() => new Set());

  const RAW_BASE = import.meta.env.VITE_API_BASE_URL || "";
  const BASE_HAS_API = /\/api\/?$/i.test(RAW_BASE);

  const path = (p) => {
    if (BASE_HAS_API) return p.startsWith("/api") ? p.replace(/^\/api/, "") : p;
    return p.startsWith("/api") ? p : `/api${p}`;
  };

  const normalizeTrack = (t) => {
    const title =
      t?.title ??
      t?.track_title ??
      t?.track_name ??
      t?.name ??
      t?.song_title ??
      t?.song_name ??
      t?.track?.title ??
      t?.track?.name ??
      null;

    const artist =
      t?.artist ??
      t?.artist_name ??
      t?.artists_name ??
      t?.singer ??
      t?.artist?.name ??
      (Array.isArray(t?.artists)
        ? t.artists.map((a) => a?.name).filter(Boolean).join(", ")
        : null) ??
      t?.track?.artist ??
      t?.track?.artist_name ??
      null;

    const track_image_url =
      t?.track_image_url ??
      t?.thumbnail_url ??
      t?.image_url ??
      t?.cover_url ??
      t?.album_image_url ??
      t?.album_cover_url ??
      t?.album?.image_url ??
      t?.album?.cover_url ??
      t?.track?.track_image_url ??
      t?.track?.thumbnail_url ??
      t?.track?.image_url ??
      null;

    const track_id =
      t?.track_id ??
      t?.id ??
      t?.trackId ??
      t?.spotify_track_id ??
      t?.spotifyId ??
      t?.track?.track_id ??
      t?.track?.id ??
      null;

    const youtube_video_id =
      t?.youtube_video_id ??
      t?.youtubeVideoId ??
      t?.youtube_id ??
      t?.youtubeId ??
      t?.video_id ??
      t?.videoId ??
      t?.track?.youtube_video_id ??
      null;

    return {
      ...t,
      track_id,
      title,
      artist,
      track_image_url,
      youtube_video_id,
    };
  };

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
    } catch {}
  }, [STORAGE_KEY]);

  useEffect(() => {
    if (!STORAGE_KEY) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(addedTracks));
  }, [STORAGE_KEY, addedTracks]);

  const fetchTrending = async () => {
    setLoadingTrending(true);
    try {
      const res = await api.get(path("/trending"), {
        params: { limit: 50 },
        headers: NGROK_HEADERS,
      });

      const raw =
        res.data?.trending ??
        res.data?.results ??
        res.data?.data ??
        res.data?.tracks ??
        res.data?.items ??
        res.data;

      const arr = Array.isArray(raw) ? raw : [];
      setTrending(arr.map(normalizeTrack));
    } catch (err) {
      console.error("Top50 불러오기 실패:", err);
      setTrending([]);
    } finally {
      setLoadingTrending(false);
    }
  };

  useEffect(() => {
    fetchTrending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSearch = async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      const res = await api.get(path("/search"), {
        params: { query, limit: 15 },
        headers: NGROK_HEADERS,
      });

      const data = res.data?.results ?? res.data ?? [];
      setResults(Array.isArray(data) ? data.map(normalizeTrack) : []);
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
      alert(
        "track_id가 없어 추가할 수 없어. 응답에 track_id(id)가 있는지 확인해줘."
      );
      return;
    }

    if (!nextIsAdd) {
      setAddedTracks((prev) =>
        prev.filter((t) => (t?.track_id || t?.id) !== trackId)
      );
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

  const listToShow = keyword.trim() ? results : trending;

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

          <button
            type="button"
            onClick={goBackToPlaylist}
            style={{ marginTop: 8 }}
          >
            완료
          </button>
        </div>

        <div className="lb_add_main">
          <div className="scroll_container">
            {!keyword.trim() && loadingTrending && (
              <div style={{ padding: 12 }}>오늘의 Top 50 불러오는 중…</div>
            )}

            {listToShow.map((item, idx) => (
              <Library_searchlist
                key={item.track_id || item.id || idx}
                data={item}
                onClick={() => {}}
                onAdd={handleAddToggle}
              />
            ))}

            {!loadingTrending && listToShow.length === 0 && (
              <div style={{ padding: 12 }}>
                {keyword.trim() ? "검색 결과가 없어." : "오늘의 Top 50이 없어."}
              </div>
            )}
          </div>
        </div>
      </div>

      <Nav />
    </div>
  );
};

export default Library_addplaylist;