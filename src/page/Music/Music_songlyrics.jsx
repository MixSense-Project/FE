import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useMusic } from '../../context/MusicContext'; 
import under from '../../assets/img/Music/under.svg';
import before_btn from "../../assets/img/Music/before.svg";
// 아이콘 경로 Music_songplay와 동일하게 맞춤
import music_play from '../../assets/img/home/music_play.svg';
import music_stop from '../../assets/img/home/music_stop.svg';
import next_btn from "../../assets/img/Music/next.svg";

const Music_songlyrics = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const { currentTrack, player, isPlay } = useMusic();
    
    const [lyrics, setLyrics] = useState("가사를 불러오는 중...");
    const [currentTime, setCurrentTime] = useState(0); 
    const [duration, setDuration] = useState(0);

    const trackData = currentTrack?.track || currentTrack;
    const trackId = location.state?.trackId || trackData?.track_id || trackData?.id;

    useEffect(() => {
        if (trackId) {
            const BASE_URL = import.meta.env.VITE_API_BASE_URL;
            axios.get(`${BASE_URL}/api/tracks/${trackId}/lyrics`)
                .then(res => {
                    setLyrics(res.data.lyrics || "등록된 가사가 없습니다.");
                })
                .catch((err) => {
                    console.error("Lyrics API Error:", err);
                    setLyrics("가사를 불러올 수 없습니다.");
                });
        }
    }, [trackId]);

    useEffect(() => {
        let timer;
        if (player && isPlay) {
            timer = setInterval(() => {
                if (typeof player.getCurrentTime === 'function') {
                    const current = player.getCurrentTime();
                    const total = player.getDuration();
                    setCurrentTime(current);
                    setDuration(total);
                }
            }, 1000);
        } else if (player && !isPlay) {
            setCurrentTime(player.getCurrentTime());
        }
        return () => clearInterval(timer);
    }, [player, isPlay]);

    const formatTime = (time) => {
        if (!time) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const handleProgressClick = (e) => {
        if (!player) return;
        const progressBar = e.currentTarget;
        const clickPosition = e.nativeEvent.offsetX;
        const barWidth = progressBar.clientWidth;
        const seekTime = (clickPosition / barWidth) * (duration || 1);
        player.seekTo(seekTime);
        setCurrentTime(seekTime);
    };

    const togglePlay = () => {
        if (!player) return;
        isPlay ? player.pauseVideo() : player.playVideo();
    };

    if (!currentTrack) return null;

    return (
        <div className='musicsonglyrics_wrap'>
            <div className="container">
                <div className="ms_header">
                    <div className="msheader_content">
                        <button className="underbtn" onClick={() => navigate(-1)}>
                            <img src={under} alt="back" />
                        </button>
                        <div className="song_detail">
                            <h1>{trackData?.title || trackData?.track_name || "Unknown Title"}</h1>
                            <p>{trackData?.artist || trackData?.artist_name || "Unknown Artist"}</p>
                        </div>
                    </div>
                </div>
                <div className="main">
                    <div className="lyrics">
                        <p>
                            {lyrics.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </p>
                    </div>
                    
                    <div className="playing" onClick={handleProgressClick} style={{ cursor: 'pointer' }}>
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

                    <div className="btns">
                        <button className="btn"><img src={before_btn} alt="before" /></button>
                        
                        {/* [수정] Music_songplay와 동일한 재생/정지 토글 로직 적용 */}
                        <button className="btn btn3" onClick={togglePlay}>
                            <img src={isPlay ? music_play : music_stop} alt="play_toggle" />
                        </button>
                        
                        <button className="btn"><img src={next_btn} alt="next" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Music_songlyrics;