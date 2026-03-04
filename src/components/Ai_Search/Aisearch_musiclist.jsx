import React, { useState } from "react";
import add_btn from "../../assets/img/AIDJ/gray_add_btn.svg";
import check_btn from "../../assets/img/home/check.svg";

const Musiclist = ({
  title,
  artist,
  thumbnail,
  onAdd,
}) => {
  const [isAdd, setIsAdd] = useState(false);

  const handleAdd = () => {
    setIsAdd((prev) => !prev);

    // 부모에게 추가 이벤트 전달 (선택)
    if (onAdd) onAdd();
  };

  return (
    <div className="aisearch_Musiclist_Wrap">
      <div className="musiclist_container">
        <div className="album_cover">
          {thumbnail && <img src={thumbnail} alt="" />}
        </div>

        <div className="music_info">
          <div className="title">{title}</div>
          <div className="artist">{artist}</div>
        </div>
      </div>

      <img className="plus_btn"
        src={isAdd ? check_btn : add_btn}
        alt=""
        onClick={handleAdd}
      />
    </div>
  );
};

export default Musiclist;