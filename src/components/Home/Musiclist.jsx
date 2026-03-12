import React, { useState } from 'react';
import { useMusic} from '../../context/MusicContext'
import add_btn from '../../assets/img/AIDJ/gray_add_btn.svg';
import check_btn from '../../assets/img/home/check.svg';
import musicplaying_icon from '../../assets/img/home/musicplaying_icon.svg';

const Musiclist = ({ data, onPlay, onAdd }) => {
  const [isAdd, setIsAdd] = useState(false);
  const { currentTrack } = useMusic(); // 현재 재생 중인 트랙 정보 가져오기
  const trackId = data.track?.youtube_video_id || data.youtube_video_id;
  const currentPlayingId = currentTrack?.track?.youtube_video_id || currentTrack?.youtube_video_id;
  const isPlayingNow = trackId === currentPlayingId;

  const Addplaylist = (e) => {
    e.stopPropagation(); 
    const nextState = !isAdd;
    setIsAdd(nextState);
    
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
                backgroundImage: `url('https://img.youtube.com/vi/${trackId}/mqdefault.jpg')`,
                backgroundSize: 'cover', 
              }}
            ></div>
            <div className="music_info">
                <div 
                  className="title" 
                  style={{ 
                    color: isPlayingNow ? 'var(--main)' : '',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                    {/* 재생 중일 때만 아이콘 표시 */}
                    {isPlayingNow && (
                      <img src={musicplaying_icon} alt="playing" style={{ width: '20px', height: '20px' }} />
                    )}
                    {data.track?.title || data.title}
                </div>
                <div className="artist">{data.track?.artist || data.artist}</div>
            </div>
        </div>
        <img src={isAdd ? check_btn : add_btn} alt="" onClick={Addplaylist}/>
    </div>
  );
};

export default Musiclist;