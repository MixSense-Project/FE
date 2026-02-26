import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import Library_likesongs from "../../components/Library/Library_likesongs";
import { getMyLikedSongs } from "../../api/like";
import { api } from "../../api/client";

const Library_likedsongs = () => {
  const navigate = useNavigate();

  const [profileId, setProfileId] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErrMsg("");

        let pid =
          localStorage.getItem("profile_id") ||
          localStorage.getItem("profileId") ||
          localStorage.getItem("PROFILE_ID");

        if (!pid) {
          const me = await api
            .get("/profile/by_user", {
              headers: { "ngrok-skip-browser-warning": "true" },
            })
            .then((res) => res.data);

          pid = me?.profiles?.[0]?.user_id;
          if (!pid) throw new Error("profile/by_user에서 user_id를 못 찾았어요.");

          localStorage.setItem("profile_id", String(pid));
        }

        setProfileId(String(pid));

        const data = await getMyLikedSongs(pid);
        setSongs(data?.mylist ?? []);
      } catch (e) {
        console.error(e);
        setErrMsg(e?.message || "좋아요 목록을 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const removeFromList = (trackId) => {
    setSongs((prev) => prev.filter((x) => x?.track_id !== trackId));
  };

  return (
    <div className="librarylikedsongs_wrap">
      <div className="container">
        <Header />

        <div className="scroll_container">
          <div className="category">
            <button className="playlist" onClick={() => navigate("/library")}>
              <p>Playlist</p>
            </button>
            <button className="liked" onClick={() => navigate("/library/liked")}>
              <p>Liked Songs</p>
            </button>
          </div>

          {loading && <p style={{ padding: 16 }}>불러오는 중...</p>}
          {!loading && errMsg && <p style={{ padding: 16 }}>에러: {errMsg}</p>}

          {!loading && !errMsg && songs.length === 0 && (
            <p style={{ padding: 16 }}>좋아요한 곡이 없어요.</p>
          )}

          {!loading &&
            !errMsg &&
            songs.map((item, idx) => (
              <Library_likesongs
                key={item?.track_id ?? `${idx}`}
                profileId={profileId}
                contentId={item?.track_id} 
                title={item?.track?.title ?? "Unknown"}
                artist={item?.track?.artist ?? "Unknown"}
                coverUrl={item?.track?.track_image_url ?? ""}
                onRemoved={() => removeFromList(item?.track_id)}
              />
            ))}
        </div>
      </div>

      <Nav />
    </div>
  );
};

export default Library_likedsongs;