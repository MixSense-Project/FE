import React, { useState } from 'react';
import add_btn from '../../assets/img/AIDJ/gray_add_btn.svg';
import check_btn from '../../assets/img/home/check.svg';

const Searchlist = ({ data, onClick }) => {
  const [isAdd, setIsAdd] = useState(false);

  // 이미지 경로 안전하게 추출
  const thumbnailUrl = data?.track_image_url || data?.thumbnail_url || (data?.youtube_video_id ? `https://img.youtube.com/vi/${data.youtube_video_id}/mqdefault.jpg` : '');

  return (
    <div 
      id="Searchlist_Wrap" 
      onClick={(e) => onClick && onClick(e, data)} // 클릭 시 부모의 handleTrackClick 실행
      style={{ cursor: 'pointer', userSelect: 'none' }}
    >
      {/* 내부 요소 클릭이 onClick을 방해하지 않도록 pointerEvents 설정 */}
      <div className="musiclist_container" style={{ pointerEvents: 'none' }}>
        <div className="album_cover">
          <img 
            src={thumbnailUrl} 
            alt="cover" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 3 }} 
          />
        </div>
        <div className="music_info">
          <div className="title" style={{ color: '#fff' }}>
            {data?.title || data?.track?.title || data?.keyword || "Unknown Song"}
          </div>
          <div className="artist" style={{ color: '#ccc' }}>
            {data?.artist || data?.track?.artist || "Unknown Artist"}
          </div>
        </div>
      </div>

      <button 
        className="add_btn" 
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation(); // 재생 이벤트가 발생하는 것을 방지
          setIsAdd(!isAdd);
        }}
      >
        <img src={isAdd ? check_btn : add_btn} alt="add" />
      </button>
    </div>
  );
};

export default Searchlist;