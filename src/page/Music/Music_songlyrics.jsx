import React, { useState, useEffect, useRef } from 'react'; // useRef 추가
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useMusic } from '../../context/MusicContext'; 
import under from '../../assets/img/Music/under.svg';
import before_btn from "../../assets/img/Music/before.svg";
import music_play from '../../assets/img/home/music_play.svg';
import music_stop from '../../assets/img/home/music_stop.svg';
import next_btn from "../../assets/img/Music/next.svg";

const Music_songlyrics = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // context에서 setIsPlay와 next 추가 추출
    const { currentTrack, player, isPlay, setIsPlay, next } = useMusic();
    
    const [lyrics, setLyrics] = useState("가사를 불러오는 중...");
    const [currentTime, setCurrentTime] = useState(0); 
    const [duration, setDuration] = useState(0);

    // 데이터 구조 정리 (Musicplay와 동일하게)
    const item = currentTrack?.track || currentTrack;
    const trackId = location.state?.trackId || item?.track_id || item?.id;
    const mixAudioUrl = currentTrack?.mix_audio_url || currentTrack?.audio_url || item?.mix_audio_url || null;
    const isAiMix = (!!mixAudioUrl && !(item?.youtube_video_id || item?.video_id));

    // 가사 불러오기
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

    // 재생 시간 업데이트 (YouTube 및 AI Mix 대응)
    useEffect(() => {
        let timer;
        if (isPlay) {
            timer = setInterval(() => {
                if (!isAiMix && player && typeof player.getCurrentTime === 'function') {
                    // YouTube Player 케이스
                    setCurrentTime(player.getCurrentTime());
                    setDuration(player.getDuration());
                } else if (isAiMix) {
                    // AI Mix는 전역 오디오 객체가 있다면 거기서 가져와야 함 
                    // (만약 Context에서 오디오 객체를 관리한다면 해당 값을 사용하세요)
                }
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [player, isPlay, isAiMix]);

    const formatTime = (time) => {
        if (!time) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    // 재생/정지 토글 (Musicplay와 로직 통일)
    const togglePlay = () => {
        if (isAiMix) {
            // Context의 setIsPlay를 통해 Musicplay에 있는 audio 태그를 제어하게 됩니다.
            setIsPlay(!isPlay);
        } else if (player) {
            isPlay ? player.pauseVideo?.() : player.playVideo?.();
            setIsPlay(!isPlay);
        }
    };

    // 다음 곡 버튼 클릭 핸들러
    const handleNext = () => {
        if (next) {
            next();
        }
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
                            <h1>{item?.title || item?.track_name || "Unknown Title"}</h1>
                            <p>{item?.artist || item?.artist_name || "Unknown Artist"}</p>
                        </div>
                    </div>
                </div>
                <div className="main">
                    <div className="lyrics">
                        <p style={{ whiteSpace: 'pre-line' }}>
                            {lyrics}
                        </p>
                    </div>
                    
                    <div className="playing" onClick={!isAiMix ? (e) => {
                        const progressBar = e.currentTarget;
                        const clickPosition = e.nativeEvent.offsetX;
                        const barWidth = progressBar.clientWidth;
                        const seekTime = (clickPosition / barWidth) * (duration || 1);
                        player?.seekTo(seekTime);
                        setCurrentTime(seekTime);
                    } : null} style={{ cursor: isAiMix ? 'default' : 'pointer' }}>
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
                        {/* 이전 곡 기능이 context에 있다면 여기에 연결 (예: prev()) */}
                        <button className="btn"><img src={before_btn} alt="before" /></button>
                        
                        <button className="btn btn3" onClick={togglePlay}>
                            <img src={isPlay ? music_play : music_stop} alt="play_toggle" />
                        </button>
                        
                        {/* [수정] next() 연동 */}
                        <button className="btn" onClick={handleNext}>
                            <img src={next_btn} alt="next" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Music_songlyrics;