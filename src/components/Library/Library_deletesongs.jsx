import React from "react";
import delete_btn from "../../assets/img/library/cancel_g.svg";
import { normalizeTrackImage } from "../../utils/track";

const Library_deletesongs = ({ data, onDelete, onSelect }) => {
  const imageSrc = normalizeTrackImage(data);

  return (
    <div
      className="deletesongs_wrap"
      style={{ cursor: "pointer" }}
      onClick={() => onSelect?.(data)}
    >
      <div className="c_pl_left">
        <div className="c_pl_cover">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 3,
              }}
            />
          ) : null}
        </div>

        <div className="song_detail">
          <p className="c_song_name">{data?.title || "Song"}</p>
          <p className="c_artist_name">{data?.artist || "Artist"}</p>
        </div>
      </div>

      <div
        className="delete"
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(data);
        }}
        style={{ cursor: "pointer" }}
      >
        <img src={delete_btn} alt="" />
      </div>
    </div>
  );
};

export default Library_deletesongs;