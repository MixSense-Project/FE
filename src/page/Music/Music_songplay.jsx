import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMusic } from '../../context/MusicContext'; 
import axios from 'axios';

// 이미지 Assets
import back_btn from "../../assets/img/Header/back_btn.svg";
import edit_btn from "../../assets/img/library/edit_btn.svg";
import heart_btn from "../../assets/img/Music/heart_btn.svg";
import fullheart_btn from '../../assets/img/Music/fullheart_btn.svg'; // ✅ 꽉 찬 하트 아이콘
import random_btn from "../../assets/img/Music/random_btn.svg";
import before_btn from "../../assets/img/Music/before.svg";
import music_play from '../../assets/img/home/music_play.svg';
import music_stop from '../../assets/img/home/music_stop.svg';
import next_btn from "../../assets/img/Music/next.svg";
import lyrics_btn from "../../assets/img/Music/lyrics.svg";
import Popup from '../Music/Popup'

const Music_songplay = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false); // ✅ 좋아요 상태 (true/false)

    const navigate = useNavigate();
    const { currentTrack, isPlay, player } = useMusic(); 
    
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // ✅ 곡 데이터 및 ID 추출
    const trackData = currentTrack?.track || currentTrack;
    const trackId = trackData?.track_id || trackData?.id || trackData?.trackId || trackData?.youtube_video_id;
    const videoId = trackData?.youtube_video_id || trackData?.video_id;

    // ✅ 좋아요 토글 핸들러
    const handleToggleLike = async () => {
        const BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const token = localStorage.getItem('access_token');
        const profileId = localStorage.getItem('profile_id'); 

        if (!trackId) {
            alert("곡 정보를 찾을 수 없습니다.");
            return;
        }

        if (!profileId) {
            alert("로그인 정보(profile_id)가 없습니다. 다시 로그인해 주세요.");
            return;
        }

        try {
            // 서버 요구사항: track_id와 profile_id 모두 문자열로 전송
            const requestData = { 
                track_id: String(trackId),
                profile_id: String(profileId) 
            };
            
            const response = await axios.post(`${BASE_URL}/user/toggle_like`, requestData, {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "69420"
                }
            });

            if (response.status === 200 || response.status === 201) {
                // ✅ 서버 응답 성공 시 상태 반전 (아이콘 변경 트리거)
                setIsLiked(!isLiked);
                console.log("좋아요 처리 완료:", response.data);
            }
            
        } catch (error) {
            console.error("좋아요 에러:", error.response?.data);
            if (error.response?.status === 403) {
                alert("권한이 없습니다.");
            } else {
                alert(error.response?.data?.detail || "처리에 실패했습니다.");
            }
        }
    };

    // 유튜브 플레이어 시간 업데이트 로직
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

                        {/* ✅ 하트 버튼: isLiked 상태에 따라 이미지 소스 변경 */}
                        <div 
                            className="heart_btn" 
                            onClick={handleToggleLike} 
                            style={{ cursor: 'pointer' }}
                        >
                            <img 
                                src={isLiked ? fullheart_btn : heart_btn} 
                                alt="like_icon" 
                                style={{ transition: 'transform 0.2s ease' }} // 부드러운 효과 추가
                            />
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
                    
                    {/* 재생 상태 아이콘 (isPlay 상태 활용) */}
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