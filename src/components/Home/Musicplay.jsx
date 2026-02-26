import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube'; // 유튜브 라이브러리 임포트
import axios from 'axios';
import music_play from '../../assets/img/home/music_play.svg';
import music_fast from '../../assets/img/home/music_fast.svg';
import music_stop from '../../assets/img/home/music_stop.svg';

const Musicplay = ({ currentTrack }) => {
    const [isPlay, setIsPlay] = useState(false);
    const [player, setPlayer] = useState(null);
    const [playStartTime, setPlayStartTime] = useState(null);

    // 1. 유튜브 플레이어 설정
    const opts = {
        height: '0', // 화면은 보이지 않게 설정
        width: '0',
        playerVars: {
            autoplay: 1, // 곡 선택 시 바로 재생
            controls: 0, // 유튜브 자체 컨트롤러 숨김
        },
    };

    // 2. 플레이어가 준비되었을 때 호출
    const onReady = (event) => {
        setPlayer(event.target);
    };

    // 3. 재생 상태 제어
    const togglePlay = () => {
        if (!player) return;

        if (isPlay) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
        setIsPlay(!isPlay);
    };

    // 4. 재생 로그 전송 로직 (30초 이상 재생 시)
    useEffect(() => {
        if (isPlay) {
            setPlayStartTime(Date.now());
        } else if (playStartTime) {
            const playedTime = Date.now() - playStartTime;
            if (playedTime >= 30000) { // 30,000ms = 30초 [cite: 222]
                sendLog(currentTrack.track_id, playedTime);
            }
            setPlayStartTime(null);
        }
    }, [isPlay]);

    const sendLog = async (trackId, msPlayed) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/logs/play`, 
                { track_id: trackId, ms_played: msPlayed },
                { headers: { Authorization: `Bearer ${token}` } }
            ); // API 명세서의 로깅 엔드포인트 활용
        } catch (error) {
            console.error("로그 전송 실패:", error);
        }
    };

    return (
        <div id="Musicplay_Wrap">
            {/* 유튜브 플레이어 (화면에는 안 보임) */}
            {currentTrack?.youtube_video_id && (
                <YouTube 
                    videoId={currentTrack.youtube_video_id} 
                    opts={opts} 
                    onReady={onReady} 
                    onStateChange={(e) => setIsPlay(e.data === 1)}
                />
            )}

            <div className="musiclist_container">
                <div className="album_cover">
                    {currentTrack && <img src={`https://img.youtube.com/vi/${currentTrack.youtube_video_id}/hqdefault.jpg`} alt="cover" />}
                </div>
                <div className="music_info">
                    <div className="title">{currentTrack?.title || "Song"}</div>
                    <div className="artist">{currentTrack?.artist || "Artist"}</div>
                </div>
            </div>
            <div className="btn_container">
                <button className="play_btn" onClick={togglePlay}>
                    <img src={isPlay ? music_stop : music_play} alt="play/stop" />
                </button>
                <button className="fast_btn">
                    <img src={music_fast} alt="fast forward" />
                </button>
            </div>
        </div>
    );
};

export default Musicplay;