import React from 'react';
import { useMusic } from '../../context/MusicContext';
import del_btn from '../../assets/img/library/cancel_g.svg';
import musicplaying_icon from '../../assets/img/home/musicplaying_icon.svg';

const Searchedlist = ({ data, onDelete, onClick }) => {
  const { currentTrack } = useMusic();

  if (!data) return null;

  // 비디오 ID 및 현재 재생 트랙 ID 추출
  const videoId = data.track?.youtube_video_id || data.youtube_video_id;
  const currentPlayingId = currentTrack?.track?.youtube_video_id || currentTrack?.youtube_video_id;

  // 재생 중 여부 확인 (ID가 존재하고 일치할 때)
  const isPlayingNow = videoId && videoId === currentPlayingId;

  return (
    <div 
      id="Searchedlist_Wrap" 
      onClick={(e) => onClick && onClick(e)} 
      style={{ cursor: 'pointer', width: '100%' }}
    >
      <div className="musiclist_container" style={{ display: 'flex', alignItems: 'center' }}>
        <div 
          className="album_cover"
          style={{
            backgroundImage: videoId ? `url('https://img.youtube.com/vi/${videoId}/mqdefault.jpg')` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        
        <div className="music_info" style={{ flex: 1 }}>
          <div 
            className="title"
            style={{ 
              // 중요: 선택 안 됐을 때(false)의 기본 색상을 화이트나 메인 텍스트색으로 명시
              color: isPlayingNow ? 'var(--main)' : '#FFFFFF', 
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '16px',
              fontWeight: isPlayingNow ? '700' : '400',
              marginBottom: '4px'
            }}
          >
            {/* 재생 중일 때만 아이콘 렌더링 */}
            {isPlayingNow && (
              <img 
                src={musicplaying_icon} 
                alt="playing" 
                style={{ width: '14px', height: '14px' }} 
              />
            )}
            <span style={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}>
              {data.keyword || data.track?.title || data.title}
            </span>
          </div>
          
          <div 
            className="artist" 
            style={{ 
              color: 'var(--gray01)', 
              fontSize: '14px' 
            }}
          >
            {data.track?.artist || data.artist || "artists"}
          </div>
        </div>
      </div>

      <div className="icon_container">
        <button 
          className="del_btn" 
          onClick={(e) => {
            e.stopPropagation(); 
            onDelete(data.search_history_id);
          }}
          style={{ background: 'none', border: 'none', padding: '5px', cursor: 'pointer' }}
        >
          <img src={del_btn} alt="delete" />
        </button>
      </div>
    </div>
  );
};

export default Searchedlist;