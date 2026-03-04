import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Nav from "../../components/Nav";
import play_btn from "../../assets/img/library/play_btn.svg";
import random_btn from "../../assets/img/library/random_btn.svg";
import plus_btn from "../../assets/img/library/plus_btn.svg";
import Library_deletesongs from "../../components/Library/Library_deletesongs";
import SubHeader from "../../components/SubHeader";
import { useMusic } from "../../context/MusicContext";

import {
  fetchMyPlaylists,
  fetchPlaylistTracks,
  removeTrackFromPlaylist,
} from "../../api/playlists";

const Library_playlist = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setCurrentTrack, playQueue } = useMusic();

  const username = useMemo(() => {
    return (
      localStorage.getItem("username") ||
      localStorage.getItem("email") ||
      "username"
    );
  }, []);

  const statePl = location.state || null;
  const params = new URLSearchParams(location.search);
  const playlistIdFromQs = params.get("id");
  const pid = statePl?.id || playlistIdFromQs || null;

  const [pl, setPl] = useState(() => {
    if (statePl?.id) return statePl;
    if (playlistIdFromQs) return { id: playlistIdFromQs, title: "", coverUrl: "" };
    return null;
  });

  const [tracks, setTracks] = useState([]);
  const [loadingTracks, setLoadingTracks] = useState(false);

  const handleSelectTrack = useCallback(
    (trackRow) => {
      const videoId =
        trackRow?.youtube_video_id ||
        trackRow?.track?.youtube_video_id ||
        trackRow?.video_id;

      if (!videoId) {
        alert("이 곡은 YouTube 영상이 매핑되지 않아 재생할 수 없어.");
        return;
      }

      // 단일 곡 선택 재생
      setCurrentTrack(trackRow);
    },
    [setCurrentTrack]
  );

  const onGoAdd = useCallback(() => {
    const playlistId = pl?.id || pid;
    if (!playlistId) return;

    navigate("/library/add/playlist", {
      state: {
        playlistId,
        playlistTitle: pl?.title || "myplaylist",
      },
    });
  }, [navigate, pl?.id, pl?.title, pid]);

  const loadTracks = useCallback(async () => {
    if (!pid) return [];

    setLoadingTracks(true);
    try {
      const data = await fetchPlaylistTracks(pid);

      const raw = Array.isArray(data)
        ? data
        : (data?.playlist_tracks ||
            data?.tracks ||
            data?.items ||
            data?.results ||
            []);

      const normalized = (Array.isArray(raw) ? raw : []).map((pt) => {
        const t = pt?.track || {};
        return {
          playlist_track_id: pt?.playlist_track_id,
          playlist_id: pt?.playlist_id,
          track_id: pt?.track_id || t?.track_id,
          added_at: pt?.added_at,

          title: t?.title ?? pt?.title ?? null,
          artist: t?.artist ?? pt?.artist ?? null,
          track_image_url: t?.track_image_url ?? pt?.track_image_url ?? null,
          youtube_video_id: t?.youtube_video_id ?? pt?.youtube_video_id ?? null,

          track: t,
        };
      });

      const seen = new Set();
      const unique = [];
      for (const x of normalized) {
        if (!x?.track_id) continue;
        if (seen.has(x.track_id)) continue;
        seen.add(x.track_id);
        unique.push(x);
      }

      setTracks(unique);
      return unique;
    } catch (e) {
      console.error("[Library_playlist] fetch tracks failed:", e);
      setTracks([]);
      return [];
    } finally {
      setLoadingTracks(false);
    }
  }, [pid]);

  const sortByAddedAtAsc = useCallback((list) => {
    return [...list].sort((a, b) => {
      const ta = a?.added_at ? new Date(a.added_at).getTime() : 0;
      const tb = b?.added_at ? new Date(b.added_at).getTime() : 0;
      return ta - tb;
    });
  }, []);

  const shuffle = useCallback((arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, []);

  // 재생: 첫 곡부터 끝까지 연속 재생
  const handlePlayAll = useCallback(async () => {
    let list = tracks;
    if (!list || list.length === 0) list = await loadTracks();

    if (!list || list.length === 0) {
      alert("플레이리스트에 곡이 없어.");
      return;
    }

    const queue = sortByAddedAtAsc(list);
    playQueue(queue, 0);
  }, [tracks, loadTracks, sortByAddedAtAsc, playQueue]);

  // 랜덤: 랜덤 한 곡을 첫 곡으로 + 나머지 랜덤 순서로 전체 재생
  const handlePlayShuffleAll = useCallback(async () => {
    let list = tracks;
    if (!list || list.length === 0) list = await loadTracks();

    if (!list || list.length === 0) {
      alert("플레이리스트에 곡이 없어.");
      return;
    }

    const randomIndex = Math.floor(Math.random() * list.length);
    const first = list[randomIndex];
    const rest = list.filter((_, i) => i !== randomIndex);
    const queue = [first, ...shuffle(rest)];

    playQueue(queue, 0);
  }, [tracks, loadTracks, shuffle, playQueue]);

  useEffect(() => {
    if (!pid) return;

    (async () => {
      try {
        const data = await fetchMyPlaylists();
        const items = Array.isArray(data) ? data : data?.playlists || data?.items || [];

        const found = items.find((p) => (p.id ?? p.playlist_id ?? p.playlistId) === pid);

        if (found) {
          setPl({
            id: found.id ?? found.playlist_id ?? found.playlistId,
            title: found.title ?? found.name ?? "Untitled",
            coverUrl: found.cover_url ?? found.coverUrl ?? found.imageUrl ?? null,
          });
        }
      } catch (e) {
        console.error("[Library_playlist] fetch playlist detail failed:", e);
      }
    })();
  }, [pid]);

  useEffect(() => {
    loadTracks();
  }, [loadTracks]);

  const handleDeleteTrack = useCallback(
    async (track) => {
      const trackId = track?.track_id;
      if (!pid || !trackId) return;

      try {
        await removeTrackFromPlaylist({ playlistId: pid, trackId });
        await loadTracks();
      } catch (e) {
        console.error("[removeTrackFromPlaylist] failed:", e);
        alert(e?.message || "삭제에 실패했어.");
      }
    },
    [pid, loadTracks]
  );

  return (
    <div className="libraryplaylist_wrap">
      <div className="container">
        <SubHeader title={"playlist"} />

        <div className="pl_header">
          <div className="pl_h_left">
            <div className="pl_h_cover">
              {pl?.coverUrl ? (
                <img
                  src={pl.coverUrl}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : null}
            </div>
          </div>

          <div className="pl_h_right">
            <p className="pl_h_name">{pl?.title || "myplaylist"}</p>
            <p className="pl_h_user">{username}</p>

            <div className="pl_h_btns">
              <button className="pl_h_playbtn" type="button" onClick={handlePlayAll}>
                <img src={play_btn} alt="" />
              </button>

              <button
                className="pl_h_randombtn"
                type="button"
                onClick={handlePlayShuffleAll}
              >
                <img src={random_btn} alt="" />
              </button>

              <button className="pl_h_plusbtn" type="button" onClick={onGoAdd}>
                <img src={plus_btn} alt="" />
              </button>
            </div>
          </div>
        </div>

        {loadingTracks ? (
          <p style={{ padding: 16, opacity: 0.8 }}>곡 목록 불러오는 중...</p>
        ) : tracks.length === 0 ? (
          <p style={{ padding: 16, opacity: 0.8 }}>
            아직 추가된 곡이 없어. + 버튼으로 곡을 추가해줘.
          </p>
        ) : (
          tracks.map((t, idx) => (
            <Library_deletesongs
              key={t?.track_id || idx}
              data={t}
              onDelete={handleDeleteTrack}
              onSelect={handleSelectTrack}
            />
          ))
        )}

        <button type="button" onClick={loadTracks} style={{ margin: 16 }}>
          새로고침
        </button>
      </div>

      <Nav />
    </div>
  );
};

export default Library_playlist;