import React from 'react';
import del_btn from '../../assets/img/library/cancel_g.svg';

const Searchedlist = ({ data, onDelete, onClick }) => {
  if (!data) return null;
  console.log("Current Data:", data);

  const videoId = data.track?.youtube_video_id || data.youtube_video_id;

  return (
    <div id="Searchedlist_Wrap" onClick={(e) => onClick && onClick(e)} style={{ cursor: 'pointer' }}>
      <div className="musiclist_container">
        <div 
          className="album_cover"
          style={{
            backgroundImage: videoId ? `url('https://img.youtube.com/vi/${videoId}/mqdefault.jpg')` : 'none',
            backgroundColor: 'var(--gray01)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="music_info">
          {/* 히스토리는 keyword가 우선, 없으면 title 표시 */}
          <div className="title">{data.keyword || data.track?.title || data.title}</div>
          <div className="artist">{data.track?.artist || data.artist || "artists"}</div>
        </div>
      </div>
      <div className="icon_container">
        <button 
          className="del_btn" 
          onClick={(e) => {
            e.stopPropagation(); // 재생 방지
            onDelete(data.search_history_id);
          }}
        >
          <img src={del_btn} alt="delete" />
        </button>
      </div>
    </div>
  );
};

export default Searchedlist;