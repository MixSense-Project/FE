import React from 'react';
import add_btn from '../../assets/img/AIDJ/gray_add_btn.svg';
import check_btn from '../../assets/img/home/check.svg'; // ✅ 체크 아이콘 추가

const Searchlist = ({ data, onPlay, onAdd, isAdded }) => { // ✅ isAdded 프롭 추가
  const videoId = data.track?.youtube_video_id || data.youtube_video_id;

  const handleAddClick = (e) => {
    e.stopPropagation(); 
    const pos = { x: e.clientX, y: e.clientY };
    if (onAdd) {
      onAdd(data, pos);
    }
  };

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
        {/* ✅ isAdded 분기 처리 */}
        <img 
          src={isAdded ? check_btn : add_btn} 
          alt="add" 
          onClick={handleAddClick}
          style={{ width: '22px', height: '22px' }}
        />
    </div> 
  );
};

export default Searchlist;