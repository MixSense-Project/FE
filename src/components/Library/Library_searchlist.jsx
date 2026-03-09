import React, { useState } from "react";
import add_btn from "../../assets/img/AIDJ/gray_add_btn.svg";
import check_btn from "../../assets/img/home/check.svg";
import { normalizeTrackImage } from "../../utils/track";

const Library_searchlist = ({ data, onClick, onAdd }) => {
  const [isAdd, setIsAdd] = useState(false);

  const imageSrc = normalizeTrackImage(data);

  return (
    <div
      id="Searchlist_Wrap"
      onMouseDown={(e) => onClick?.(e, data)}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      <div className="musiclist_container" style={{ pointerEvents: "none" }}>
        <div className="album_cover">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="cover"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 3,
              }}
            />
          ) : null}
        </div>

        <div className="music_info">
          <div className="title">{data?.title || "Unknown Song"}</div>
          <div className="artist">{data?.artist || "Unknown Artist"}</div>
        </div>
      </div>

      <button
        className="add_btn"
        onMouseDown={(e) => {
          e.stopPropagation();
          const next = !isAdd;
          setIsAdd(next);
          onAdd?.(e, data, next);
        }}
      >
        <img src={isAdd ? check_btn : add_btn} alt="" />
      </button>
    </div>
  );
};

export default Library_searchlist;