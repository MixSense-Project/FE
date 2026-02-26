import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Nav from "../../components/Nav";
import play_btn from "../../assets/img/library/play_btn.svg";
import random_btn from "../../assets/img/library/random_btn.svg";
import plus_btn from "../../assets/img/library/plus_btn.svg";
import Library_deletesongs from "../../components/Library/Library_deletesongs";
import SubHeader from "../../components/SubHeader";
import { fetchMyPlaylists } from "../../api/playlists";

const Library_playlist = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // username은 로그인 응답에서 따로 저장해두면 제일 좋고(아래 참고),
  // 없으면 email을 대신 보여주게 fallback
  const username = useMemo(() => {
    return (
      localStorage.getItem("username") ||
      localStorage.getItem("email") ||
      "username"
    );
  }, []);

  // ✅ 1) state로 받은 값(즉시 표시용)
  const statePl = location.state || null;

  // ✅ 2) querystring의 id (새로고침 대비)
  const params = new URLSearchParams(location.search);
  const playlistIdFromQs = params.get("id");

  const [pl, setPl] = useState(() => {
    if (statePl?.id) return statePl;
    if (playlistIdFromQs) return { id: playlistIdFromQs, title: "", coverUrl: "" };
    return null;
  });

  // ✅ 3) 최신 데이터로 보강(새로고침/직접접속도 OK)
  useEffect(() => {
    const pid = statePl?.id || playlistIdFromQs;
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
  }, [statePl?.id, playlistIdFromQs]);

  const onGoAdd = () => {
    if (!pl?.id) return;

    // ✅ add 페이지에서 헤더에 타이틀 보여주려고 같이 넘김
    navigate("/library/add/playlist", {
      state: {
        playlistId: pl.id,
        playlistTitle: pl.title || "myplaylist",
      },
    });
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

        <Library_deletesongs />
        <Library_deletesongs />
      </div>

      <Nav />
    </div>
  );
};

export default Library_playlist;