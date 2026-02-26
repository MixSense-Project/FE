import React, { useState } from "react";
import heart_icon from "../../assets/img/library/heart.svg";
import emptyheart_icon from "../../assets/img/library/emptyheart_icon.svg";
import { toggleLike } from "../../api/like";

const Library_likesongs = ({
  profileId,
  contentId,
  title,
  artist,
  coverUrl,
  onRemoved,
}) => {
  const [liked, setLiked] = useState(true);
  const [busy, setBusy] = useState(false);

  const onClickHeart = async () => {
    if (busy) return;
    try {
      setBusy(true);

      const res = await toggleLike({ profileId, contentId });

      const status =
        (typeof res === "string" ? res : res?.status) ||
        res?.data?.status;

      if (status === "unliked") {
        onRemoved?.();
        return;
      }

      if (status === "liked") {
        setLiked(true);
        return;
      }

      setLiked((p) => !p);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="deletesongs_wrap">
      <div className="c_pl_left">
        <div className="c_pl_cover">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title || "cover"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : null}
        </div>

        <div className="song_detail">
          <p className="c_song_name">{title}</p>
          <p className="c_artist_name">{artist}</p>
        </div>
      </div>

      <div
        className="heart"
        onClick={onClickHeart}
        style={{ opacity: busy ? 0.6 : 1, pointerEvents: busy ? "none" : "auto" }}
      >
        <img src={liked ? heart_icon : emptyheart_icon} alt="like" />
      </div>
    </div>
  );
};

export default Library_likesongs;