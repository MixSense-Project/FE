import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import axios from 'axios';
import music_play from '../../assets/img/home/music_play.svg';
import music_fast from '../../assets/img/home/music_fast.svg';
import music_stop from '../../assets/img/home/music_stop.svg';

const Musicplay = ({ currentTrack }) => {
    const [isPlay, setIsPlay] = useState(false);
    const [player, setPlayer] = useState(null);
    const [startTime, setStartTime] = useState(null);

    // 1. 데이터 구조에 따른 youtube_video_id 추출 
    const videoId = currentTrack?.youtube_video_id || currentTrack?.track?.youtube_video_id;

    // 2. 유튜브 플레이어 설정 
    const opts = {
        height: '0',
        width: '0',
        playerVars: {
            autoplay: 1, // 곡 선택 시 자동 재생
            controls: 0, // 유튜브 컨트롤러 숨김
        },
    };

    // 3. 곡이 바뀌면 재생 상태 초기화
    useEffect(() => {
        if (videoId) {
            setIsPlay(true);
        }
    }, [videoId]);

    // 4. 30초 이상 재생 시 로그 전송 
    useEffect(() => {
        if (isPlay) {
            setStartTime(Date.now());
        } else {
            if (startTime) {
                const duration = Date.now() - startTime;
                if (duration >= 30000) {
                    const token = localStorage.getItem('access_token');
                    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
                    axios.post(`${BASE_URL}/api/logs/play`, 
                        { track_id: currentTrack?.track_id || currentTrack?.track?.track_id, ms_played: duration },
                        { headers: { Authorization: `Bearer ${token}` } }
                    ).catch(err => console.error("Log send failed", err));
                }
                setStartTime(null);
            }
        }
    }, [isPlay, videoId]);

    // 재생/정지 버튼 핸들러
    const togglePlay = () => {
        if (!player) return;
        if (isPlay) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    };

    // 만약 videoId가 없으면 아무것도 렌더링하지 않음 (404 방지)
    if (!videoId) return null;

    return (
        <div id="Musicplay_Wrap">
            <YouTube 
                videoId={videoId} 
                opts={opts} 
                onReady={(e) => {
                    setPlayer(e.target);
                    setIsPlay(true);
                }} 
                onStateChange={(e) => {
                    setIsPlay(e.data === 1);
                }}
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
                        <div className="title">{currentTrack?.track?.title || currentTrack?.title || "Unknown Title"}</div>
                        <div className="artist">{currentTrack?.track?.artist || currentTrack?.artist || "Unknown Artist"}</div>
                    </div>
                </div>

                <div className="btn_container">
                    <button className="play_btn" onClick={togglePlay}>
                        <img src={isPlay ? music_play : music_stop} alt="play_stop" />
                    </button>
                    <button className="fast_btn">
                        <img src={music_fast} alt="fast" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Musicplay;