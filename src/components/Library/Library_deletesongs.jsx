import React from "react";
import delete_btn from "../../assets/img/library/cancel_g.svg";
import { normalizeTrackImage } from "../../utils/track";

const Library_deletesongs = ({ data, onDelete, onSelect }) => {
  const imageSrc = normalizeTrackImage(data);

  const title =
    data?.title ||
    data?.track?.title ||
    data?.mix?.title ||
    "Song";

  const artist =
    data?.artist ||
    data?.track?.artist ||
    data?.mix?.artist ||
    "Artist";

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
          <p className="c_song_name">{title}</p>
          <p className="c_artist_name">{artist}</p>
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