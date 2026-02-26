import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import axios from 'axios';
import { useMusic } from '../../context/MusicContext'; 
import music_play from '../../assets/img/home/music_play.svg';
import music_fast from '../../assets/img/home/music_fast.svg';
import music_stop from '../../assets/img/home/music_stop.svg';

const Musicplay = () => {
    const { currentTrack } = useMusic(); 
    const [isPlay, setIsPlay] = useState(false);
    const [player, setPlayer] = useState(null);
    const [startTime, setStartTime] = useState(null);

    // Context로부터 넘어온 데이터 로그 확인
    useEffect(() => {
        if (currentTrack) {
            console.log("🎧 [Musicplay 수신 데이터]:", currentTrack);
        }
    }, [currentTrack]);

    const videoId = currentTrack?.youtube_video_id || currentTrack?.track?.youtube_video_id || currentTrack?.video_id;

    const opts = {
        height: '0', width: '0',
        playerVars: { autoplay: 1, controls: 0 },
    };

    useEffect(() => {
        if (videoId) {
            console.log("📺 [Musicplay] 최종 비디오 ID:", videoId);
            setIsPlay(true);
        } else {
            console.warn("⚠️ [Musicplay] 비디오 ID가 없습니다. 렌더링이 중단됩니다.");
        }
    }, [videoId]);

    useEffect(() => {
        if (isPlay) {
            setStartTime(Date.now());
        } else if (startTime) {
            const duration = Date.now() - startTime;
            if (duration >= 30000) {
                const token = localStorage.getItem('access_token');
                const BASE_URL = import.meta.env.VITE_API_BASE_URL;
                const trackId = currentTrack?.track_id || currentTrack?.track?.track_id || currentTrack?.id;
                
                axios.post(`${BASE_URL}/api/logs/play`, 
                    { track_id: trackId, ms_played: duration },
                    { headers: { Authorization: `Bearer ${token}` } }
                ).catch(err => console.error("Log failed", err));
            }
            setStartTime(null);
        }
    }, [isPlay, videoId]);

    const togglePlay = () => {
        if (!player) return;
        isPlay ? player.pauseVideo() : player.playVideo();
    };

    if (!videoId) return null; // 여기서 null을 반환하면 플레이어가 사라짐

    return (
        <div id="Musicplay_Wrap">
            <YouTube 
                videoId={videoId} 
                opts={opts} 
                onReady={(e) => { setPlayer(e.target); setIsPlay(true); }} 
                onStateChange={(e) => setIsPlay(e.data === 1)} 
            />
            <div className="musicplay_wrap">
                <div className="musiclist_container">
                    <div className="album_cover">
                        <img 
                            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} 
                            alt="cover" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                    </div>
                    <div className="music_info">
                        <div className="title">{currentTrack?.title || currentTrack?.track?.title || "Unknown Title"}</div>
                        <div className="artist">{currentTrack?.artist || currentTrack?.track?.artist || "Unknown Artist"}</div>
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