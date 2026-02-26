import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMusic } from '../../context/MusicContext'; 

import back_btn from "../../assets/img/Header/back_btn.svg";
import edit_btn from "../../assets/img/library/edit_btn.svg";
import heart_btn from "../../assets/img/Music/heart_btn.svg";
import random_btn from "../../assets/img/Music/random_btn.svg";
import before_btn from "../../assets/img/Music/before.svg";
import music_play from '../../assets/img/home/music_play.svg';
import music_stop from '../../assets/img/home/music_stop.svg';
import next_btn from "../../assets/img/Music/next.svg";
import lyrics_btn from "../../assets/img/Music/lyrics.svg";

const Music_songplay = () => {
    const navigate = useNavigate();
    const { currentTrack, isPlay, player } = useMusic(); 
    
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // [중요] 데이터 구조가 깊을 수 있으므로 공통 참조 변수 생성
    const trackData = currentTrack?.track || currentTrack;
    
    const videoId = trackData?.youtube_video_id || trackData?.video_id;
    const trackId = trackData?.track_id || trackData?.id;

    // 재생 시간 및 바(Bar) 실시간 업데이트
    useEffect(() => {
        let timer;
        if (player && isPlay) {
            timer = setInterval(() => {
                if (typeof player.getCurrentTime === 'function') {
                    setCurrentTime(player.getCurrentTime());
                    setDuration(player.getDuration());
                }
            }, 1000);
        } else if (player && !isPlay) {
            setCurrentTime(player.getCurrentTime());
        }
        return () => clearInterval(timer);
    }, [player, isPlay]);

    const togglePlay = () => {
        if (!player) return;
        isPlay ? player.pauseVideo() : player.playVideo();
    };

    const formatTime = (time) => {
        if (!time) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    if (!videoId) return null;

    return (
        <div className="musicsongplay_wrap">
            <div className="container">
                <div className="ms_header">
                    <div className="msheader_content">
                        <button className="back_btn" onClick={() => navigate(-1)}>
                            <img src={back_btn} alt="back" />
                        </button>
                        <h1 className="title">Music</h1>
                        <button className="edit_btn"><img src={edit_btn} alt="edit" /></button>
                    </div>
                </div>

                <div className="ms_main">
                    <div className="ms_cover">
                        <img 
                            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                            alt="cover" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }} 
                        />
                    </div>
                    
                    <div className="ms_detail">
                        <div className="song_detail">
                            {/* [수정] trackData를 참조하여 제목과 아티스트 표시 */}
                            <h1>{trackData?.title || trackData?.track_name || "Unknown Title"}</h1>
                            <p>{trackData?.artist || trackData?.artist_name || "Unknown Artist"}</p>
                        </div>
                        <div className="heart_btn"><img src={heart_btn} alt="like" /></div>
                    </div>

                    <div className="playing">
                        <div className="playing_bar">
                            <div 
                                className="playing_progress" 
                                style={{ 
                                    width: `${(currentTime / (duration || 1)) * 100}%`,
                                    transition: 'width 0.2s linear'
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="time">
                        <p className="time_start">{formatTime(currentTime)}</p>
                        <p className="time_end">{formatTime(duration)}</p>
                    </div>
                </div>

                <div className="ms_btns">
                    <button className="btn"><img src={random_btn} alt="random" /></button>
                    <button className="btn"><img src={before_btn} alt="before" /></button>
                    
                    <button className="btn btn3" onClick={togglePlay}>
                        <img src={isPlay ? music_play : music_stop} alt="play_toggle" />
                    </button>
                    
                    <button className="btn"><img src={next_btn} alt="next" /></button>
                    
                    <button className="btn" onClick={() => navigate("/music/songlyrics", { state: { trackId } })}>
                        <img src={lyrics_btn} alt="lyrics" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Music_songplay;