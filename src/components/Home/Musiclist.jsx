import React, { useState } from 'react';
import add_btn from '../../assets/img/AIDJ/gray_add_btn.svg';
import check_btn from '../../assets/img/home/check.svg';

const Musiclist = ({ data, onPlay }) => {
  const [isAdd, setIsAdd] = useState(false);

  const Addplaylist = (e) => {
    e.stopPropagation(); // + 버튼 클릭 시 재생되는 것 방지
    setIsAdd(!isAdd);
  };

  return (
    <div id="Musiclist_Wrap" onClick={onPlay} style={{ cursor: 'pointer' }}>
        <div className="musiclist_container">
            <div 
              className="album_cover"
              style={{
                // 유튜브 ID 기반 썸네일 우선 적용 (MixSense 설계 반영)
                backgroundImage: `url('https://img.youtube.com/vi/${data.track?.youtube_video_id || data.youtube_video_id}/mqdefault.jpg')`,
                backgroundSize: 'cover', 
              }}
            ></div>
            <div className="music_info">
                <div className="title">{data.track?.title || data.title}</div>
                <div className="artist">{data.track?.artist || data.artist}</div>
            </div>
        </div>
        <img src={isAdd ? check_btn : add_btn} alt="" onClick={Addplaylist}/>
    </div>
  );
};

export default Musiclist;