import React, { useState } from 'react';
import add_btn from '../../assets/img/AIDJ/gray_add_btn.svg';
import check_btn from '../../assets/img/home/check.svg';

const Searchlist = ({ data, onPlay }) => { // onPlay로 프롭스 이름 변경
  const [isAdd, setIsAdd] = useState(false);

  const Addplaylist = (e) => {
    e.stopPropagation(); // + 버튼 클릭 시 재생 방지
    setIsAdd(!isAdd);
  };

  // 비디오 ID 추출 로직
  const videoId = data.track?.youtube_video_id || data.youtube_video_id;

  return (
    <div id="Searchlist_Wrap" onClick={onPlay} style={{ cursor: 'pointer' }}>
        <div className="musiclist_container">
            <div 
              className="album_cover"
              style={{
                backgroundImage: videoId ? `url('https://img.youtube.com/vi/${videoId}/mqdefault.jpg')` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: 'var(--gray01)'
              }}
            ></div>
            <div className="music_info">
                <div className="title">{data.track?.title || data.title || "Unknown Title"}</div>
                <div className="artist">{data.track?.artist || data.artist || "Unknown Artist"}</div>
            </div>
        </div>
        <img 
          src={isAdd ? check_btn : add_btn} 
          alt="add" 
          onClick={Addplaylist} 
          style={{ width: '22px', height: '22px' }}
        />
    </div> 
  );
};

export default Searchlist;