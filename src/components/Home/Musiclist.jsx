import React from 'react';
import add_btn from '../../assets/img/AIDJ/gray_add_btn.svg';
import musicplaying_icon from '../../assets/img/home/musicplaying_icon.svg';
import check_icon from '../../assets/img/home/check.svg';
import nocheck_icon from '../../assets/img/AIDJ/empty_circle.svg';

// isPlaying을 부모로부터 직접 전달받습니다.
const Musiclist = ({ data, onAdd, isSelected, isPlaying }) => {
  
  const handleIconClick = (e) => {
    e.stopPropagation(); 
    if (onAdd) {
      // isSelected 상태에 따라 토글 처리
      onAdd(data, !isSelected);
    }
  };

  // 썸네일 경로 처리
  const thumbUrl = data.thumbnail || `https://img.youtube.com/vi/${data.track?.youtube_video_id || data.youtube_video_id}/mqdefault.jpg`;

  return (
    <div id="Musiclist_Wrap" style={{ cursor: 'pointer' }}>
        <div className="musiclist_container">
            <div 
              className="album_cover"
              style={{ backgroundImage: `url('${thumbUrl}')`, backgroundSize: 'cover' }}
            ></div>
            <div className="music_info">
                {/* 재생 중일 때 색상은 var(--main), 앞에 아이콘 추가 */}
                <div 
                  className="title" 
                  style={{ 
                    color: isPlaying ? 'var(--main)' : '#fff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    fontWeight: isPlaying ? '600' : '400'
                  }}
                >
                    {isPlaying && (
                      <img src={musicplaying_icon} alt="playing" style={{ width: '16px', height: '16px' }} />
                    )}
                    {data.track?.title || data.title}
                </div>
                {/* 아티스트 정보 (데이터에 있을 경우만 출력) */}
                {(data.track?.artist || data.artist) && (
                  <div className="artist">{data.track?.artist || data.artist}</div>
                )}
            </div>
        </div>

        {/* 우측 아이콘 (체크/미체크 버튼) */}
        <img 
          src={isSelected === undefined ? add_btn : (isSelected ? check_icon : nocheck_icon)} 
          alt="icon" 
          onClick={handleIconClick}
          style={{ width: '24px', height: '24px' }}
        />
    </div>
  );
};

export default Musiclist;