import React from 'react';
import { useMusic } from '../../context/MusicContext';
import add_btn from '../../assets/img/AIDJ/gray_add_btn.svg';
import musicplaying_icon from '../../assets/img/home/musicplaying_icon.svg';
import check_icon from '../../assets/img/home/check.svg';
import nocheck_icon from '../../assets/img/AIDJ/empty_circle.svg';

const Musiclist = ({ data, onPlay, onAdd, isSelected }) => {
  const { currentTrack } = useMusic(); 
  
  // ID 추출 로직 (mix_track_id 우선 확인)
  const trackId = data.mix_track_id || data.track?.youtube_video_id || data.youtube_video_id;
  const currentPlayingId = currentTrack?.track?.youtube_video_id || currentTrack?.youtube_video_id;
  const isPlayingNow = trackId && trackId === currentPlayingId;

  const handleIconClick = (e) => {
    e.stopPropagation(); 
    
    if (onAdd) {
      if (isSelected !== undefined) {
        onAdd(data, !isSelected);
      } else {
        const pos = { x: e.clientX, y: e.clientY };
        onAdd(data, pos);
      }
    }
  };

  const thumbUrl = data.thumbnail || `https://img.youtube.com/vi/${data.track?.youtube_video_id || data.youtube_video_id}/mqdefault.jpg`;

  return (
    <div id="Musiclist_Wrap" onClick={onPlay} style={{ cursor: 'pointer' }}>
        <div className="musiclist_container">
            <div 
              className="album_cover"
              style={{ backgroundImage: `url('${thumbUrl}')`, backgroundSize: 'cover' }}
            ></div>
            <div className="music_info">
                <div className="title" style={{ color: isPlayingNow ? 'var(--main)' : '', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {isPlayingNow && <img src={musicplaying_icon} alt="playing" style={{ width: '20px', height: '20px' }} />}
                    {data.track?.title || data.title}
                </div>
                <div className="artist">{data.track?.artist || data.artist}</div>
            </div>
        </div>

        <img 
          src={isSelected === undefined ? add_btn : (isSelected ? check_icon : nocheck_icon)} 
          alt="icon" 
          onClick={handleIconClick}
        />
    </div>
  );
};

export default Musiclist;