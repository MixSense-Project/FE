import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Nav from "../../components/Nav";
import play_btn from "../../assets/img/library/play_btn.svg";
import random_btn from "../../assets/img/library/random_btn.svg";
import plus_btn from "../../assets/img/library/plus_btn.svg";
import Library_deletesongs from "../../components/Library/Library_deletesongs";
import SubHeader from "../../components/SubHeader";
import {
  fetchMyPlaylists,
  fetchPlaylistTracks,
  removeTrackFromPlaylist,
} from "../../api/playlists";

const Library_playlist = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    if (!pid) return;

    (async () => {
      try {
        const data = await fetchMyPlaylists();
        const items = Array.isArray(data)
          ? data
          : data?.playlists || data?.items || [];

        const found = items.find(
          (p) => (p.id ?? p.playlist_id ?? p.playlistId) === pid
        );

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

  const loadTracks = useCallback(async () => {
    if (!pid) return;

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

          title: t?.title,
          artist: t?.artist,
          track_image_url: t?.track_image_url,
          youtube_video_id: t?.youtube_video_id,

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
      console.log("[Playlist Tracks unique]", unique);
    } catch (e) {
      console.error("[Library_playlist] fetch tracks failed:", e);
      setTracks([]);
    } finally {
      setLoadingTracks(false);
    }
  }, [pid]);

  useEffect(() => {
    loadTracks();
  }, [loadTracks]);

  const handleDeleteTrack = async (track) => {
    const trackId = track?.track_id;
    if (!pid || !trackId) return;

    try {
      await removeTrackFromPlaylist({ playlistId: pid, trackId });
      await loadTracks(); 
    } catch (e) {
      console.error("[removeTrackFromPlaylist] failed:", e);
      alert(e?.message || "삭제에 실패했어.");
    }
  };

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
              <button className="pl_h_playbtn" type="button">
                <img src={play_btn} alt="" />
              </button>

              <button className="pl_h_randombtn" type="button">
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