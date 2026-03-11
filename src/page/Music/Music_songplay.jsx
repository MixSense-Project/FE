import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMusic } from '../../context/MusicContext'; 
import axios from 'axios'; // axios 추가

import back_btn from "../../assets/img/Header/back_btn.svg";
import edit_btn from "../../assets/img/library/edit_btn.svg";
import heart_btn from "../../assets/img/Music/heart_btn.svg";
// 좋아요 활성화 시 사용할 아이콘이 있다면 추가 (예: heart_on.svg)
// import heart_on from "../../assets/img/Music/heart_on.svg"; 
import random_btn from "../../assets/img/Music/random_btn.svg";
import before_btn from "../../assets/img/Music/before.svg";
import music_play from '../../assets/img/home/music_play.svg';
import music_stop from '../../assets/img/home/music_stop.svg';
import next_btn from "../../assets/img/Music/next.svg";
import lyrics_btn from "../../assets/img/Music/lyrics.svg";
import Popup from '../Music/Popup'

const Music_songplay = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false); // 좋아요 상태 관리

    const navigate = useNavigate();
    const { currentTrack, isPlay, player } = useMusic(); 
    
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const trackData = currentTrack?.track || currentTrack;
    const videoId = trackData?.youtube_video_id || trackData?.video_id;
    const trackId = trackData?.track_id || trackData?.id;

    const handleToggleLike = async () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('access_token');
    
    // 1. 데이터 확인 로그
    console.log("요청 보낼 trackId:", trackId);
    console.log("현재 토큰 존재 여부:", !!token);

    if (!trackId) {
        alert("곡 정보가 없습니다.");
        return;
    }

    try {
        // 2. API 주소 확인: /api/user/toggle_like 인지 /user/toggle_like 인지 확인 필요
        // 보통 BASE_URL 뒤에 바로 붙이거나 /api를 포함합니다.
        const response = await axios.post(`${BASE_URL}/api/user/toggle_like`, 
            { track_id: trackId }, 
            {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "69420" // ngrok 사용 시 필수
                }
            }
        );

        console.log("좋아요 응답 성공:", response.data);
        setIsLiked(!isLiked);
        
    } catch (error) {
        // 3. 에러의 상세 내용을 콘솔에 출력
        console.error("좋아요 에러 상세:", error.response);
        
        if (error.response?.status === 401) {
            alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        } else if (error.response?.status === 404) {
            alert("API 경로를 찾을 수 없습니다. (404)");
        } else {
            alert(error.response?.data?.message || "좋아요 처리에 실패했습니다.");
        }
    }
};

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
                        <button className="edit_btn" onClick={()=>setIsPopupOpen(true)}>
                            <img src={edit_btn} alt="edit" />
                        </button>
                    </div>
                </div>

                <div className="ms_main">
                    <div className="ms_cover">
                        <img 
                            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                            alt="cover" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} 
                        />
                    </div>
                    
                    <div className="ms_detail">
                        <div className="song_detail">
                            <h1>{trackData?.title || trackData?.track_name || "Unknown Title"}</h1>
                            <p>{trackData?.artist || trackData?.artist_name || "Unknown Artist"}</p>
                        </div>
                        {/* 2. 하트 버튼에 onClick 연결 및 스타일 변경 */}
                        <div 
                            className="heart_btn" 
                            onClick={handleToggleLike} 
                            style={{ cursor: 'pointer', opacity: isLiked ? 1 : 0.5 }}
                        >
                            <img src={heart_btn} alt="like" />
                        </div>
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
                {isPopupOpen && <Popup onClose={()=>setIsPopupOpen(false)}/>}
            </div>
        </div>
    );
};

export default Music_songplay;