import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMusic } from '../../context/MusicContext'; 
import music_play from '../../assets/img/home/music_play.svg';
import music_stop from '../../assets/img/home/music_stop.svg';
import music_fast from '../../assets/img/home/music_fast.svg';

const Musicplay = () => {
    const { currentTrack, isPlay, player } = useMusic();
    const navigate = useNavigate();

    const trackData = currentTrack?.track || currentTrack;
    const videoId = trackData?.youtube_video_id || trackData?.video_id;

    if (!videoId) return null;

    const togglePlay = (e) => {
        e.stopPropagation();
        if (!player) return;
        isPlay ? player.pauseVideo() : player.playVideo();
    };

    return (
        <div id="Musicplay_Wrap" onClick={() => navigate('/music/songplay')}>
            <div className="musicplay_wrap">
                <div className="musiclist_container">
                    {/* 앨범 커버 이미지 비율 수정 */}
                    <div className="album_cover" style={{ overflow: 'hidden', borderRadius: '8px' }}>
                        <img 
                            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} 
                            alt="cover" 
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover', // 핵심: 컨테이너 비율에 맞춰 꽉 채움
                                display: 'block'
                            }} 
                        />
                    </div>
                    
                    <div className="music_info">
                        <div className="title">
                            {trackData?.title || trackData?.track_name || "Unknown Title"}
                        </div>
                        <div className="artist">
                            {trackData?.artist || trackData?.artist_name || "Unknown Artist"}
                        </div>
                    </div>
                </div>
                <div className="btn_container">
                    <button className="play_btn" onClick={togglePlay}>
                        <img src={isPlay ? music_play : music_stop} alt="play_stop" />
                    </button>
                    <button className="fast_btn"><img src={music_fast} alt="fast" /></button>
                </div>
            </div>
        </div>
    );
};

export default Musicplay;