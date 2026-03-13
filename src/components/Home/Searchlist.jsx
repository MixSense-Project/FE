import React from 'react';
import add_btn from '../../assets/img/AIDJ/gray_add_btn.svg';

const Searchlist = ({ data, onPlay, onAdd }) => { // ✅ onAdd 프롭스 추가
  // 비디오 ID 추출 로직
  const videoId = data.track?.youtube_video_id || data.youtube_video_id;

  const handleAddClick = (e) => {
    e.stopPropagation(); // + 버튼 클릭 시 재생 방지
    
    // ✅ 클릭한 위치의 좌표 추출
    const pos = { x: e.clientX, y: e.clientY };
    
    // ✅ 부모에게 데이터와 위치 전달
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
        <img 
          src={add_btn} // 팝업이 뜰 것이므로 체크 버튼 상태는 필요 없습니다.
          alt="add" 
          onClick={handleAddClick} // ✅ 클릭 핸들러 변경
          style={{ width: '22px', height: '22px' }}
        />
    </div> 
  );
};

export default Searchlist;