import React, { useState } from 'react';
import add_btn from '../../assets/img/AIDJ/gray_add_btn.svg';
import check_btn from '../../assets/img/home/check.svg';

const Musiclist = ({ data, onPlay, onAdd }) => { // onAdd 프롭 추가
  const [isAdd, setIsAdd] = useState(false);

  const Addplaylist = (e) => {
    e.stopPropagation(); 
    const nextState = !isAdd;
    setIsAdd(nextState);
    
    // 부모 컴포넌트로 이 곡의 정보와 체크 여부를 전달합니다.
    if (onAdd) {
      onAdd(data, nextState);
    }
  };

  return (
    <div id="Musiclist_Wrap" onClick={onPlay} style={{ cursor: 'pointer' }}>
        <div className="musiclist_container">
            <div 
              className="album_cover"
              style={{
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