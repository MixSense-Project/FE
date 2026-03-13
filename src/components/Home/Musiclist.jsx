import React from 'react';
import { useMusic } from '../../context/MusicContext'
import add_btn from '../../assets/img/AIDJ/gray_add_btn.svg';
import musicplaying_icon from '../../assets/img/home/musicplaying_icon.svg';

const Musiclist = ({ data, onPlay, onAdd }) => {
  const { currentTrack } = useMusic(); 
  const trackId = data.track?.youtube_video_id || data.youtube_video_id;
  const currentPlayingId = currentTrack?.track?.youtube_video_id || currentTrack?.youtube_video_id;
  const isPlayingNow = trackId === currentPlayingId;

  const handleAddClick = (e) => {
    e.stopPropagation(); 
    
    // ✅ 클릭한 위치 좌표 추출
    const pos = { x: e.clientX, y: e.clientY };
    
    if (onAdd) {
      onAdd(data, pos); // 데이터와 위치를 부모에게 전달
    }
  };

  return (
    <div id="Musiclist_Wrap" onClick={onPlay} style={{ cursor: 'pointer' }}>
        <div className="musiclist_container">
            <div 
              className="album_cover"
              style={{ backgroundImage: `url('https://img.youtube.com/vi/${trackId}/mqdefault.jpg')`, backgroundSize: 'cover' }}
            ></div>
            <div className="music_info">
                <div className="title" style={{ color: isPlayingNow ? 'var(--main)' : '', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {isPlayingNow && <img src={musicplaying_icon} alt="playing" style={{ width: '20px', height: '20px' }} />}
                    {data.track?.title || data.title}
                </div>
                <div className="artist">{data.track?.artist || data.artist}</div>
            </div>
        </div>
        <img src={add_btn} alt="add" onClick={handleAddClick}/>
    </div>
  );
};

export default Musiclist;