import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMusic } from '../../context/MusicContext'; 
import axios from 'axios';
import { toggleLike } from "../../api/like"; 

// 이미지 Assets
import heart_icon from "../../assets/img/library/heart.svg"; 
import emptyheart_icon from "../../assets/img/library/emptyheart_icon.svg"; 
import back_btn from "../../assets/img/Header/back_btn.svg";
import edit_btn from "../../assets/img/library/edit_btn.svg";
import random_btn from "../../assets/img/Music/random_btn.svg";
import before_btn from "../../assets/img/Music/before.svg";
import music_play from '../../assets/img/home/music_play.svg';
import music_stop from '../../assets/img/home/music_stop.svg';
import next_btn from "../../assets/img/Music/next.svg";
import lyrics_btn from "../../assets/img/Music/lyrics.svg";
import Popup from '../Music/Popup';

const Music_songplay = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [liked, setLiked] = useState(false); 
    const [busy, setBusy] = useState(false);

    const navigate = useNavigate();
    
    const { currentTrack, isPlay, setIsPlay, player, next } = useMusic(); 
    
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const item = currentTrack?.track || currentTrack;
    const t_id = String(item?.track_id || "");
    const d_id = String(item?.id || "");
    const v_id = String(item?.youtube_video_id || item?.video_id || "");
    
    const mixAudioUrl = currentTrack?.mix_audio_url || currentTrack?.audio_url || item?.mix_audio_url || null;
    const isAiMix = (!!mixAudioUrl && !v_id);

    // 좋아요 동기화 로직 (유지)
    useEffect(() => {
        const syncLikeStatus = async () => {
            const profileId = localStorage.getItem('profile_id');
            const token = localStorage.getItem('access_token');
            const BASE_URL = import.meta.env.VITE_API_BASE_URL;

            if (!profileId) return;
            setLiked(false);

            const myCurrentIds = [t_id, d_id, v_id].filter(id => id !== "");
            if (myCurrentIds.length === 0) return;

            try {
                const res = await axios.get(`${BASE_URL}/user/mylist/${profileId}`, {
                    headers: { 
                        "Authorization": `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "69420"
                    }
                });

                const mylist = res.data.mylist || res.data; 
                if (Array.isArray(mylist)) {
                    const isFound = mylist.some(item => {
                        const itemTrackId = String(item.track_id || "");
                        const itemId = String(item.id || "");
                        const itemVideoId = String(item.youtube_video_id || item.video_id || "");
                        const serverIds = [itemTrackId, itemId, itemVideoId].filter(id => id !== "");
                        return myCurrentIds.some(myId => serverIds.includes(myId));
                    });
                    setLiked(isFound);
                }
            } catch (error) {
                console.error("좋아요 동기화 실패:", error);
            }
        };
        syncLikeStatus();
    }, [t_id, v_id, d_id]);

    const onClickHeart = async () => {
        if (busy) return;
        const profileId = localStorage.getItem('profile_id');
        const contentId = t_id || v_id || d_id;

        try {
            setBusy(true);
            const res = await toggleLike({ profileId, contentId });
            const status = (typeof res === "string" ? res : res?.status) || res?.data?.status;
            if (status === "unliked") setLiked(false);
            else if (status === "liked") setLiked(true);
            else setLiked(!liked);
        } catch (e) {
            console.error("좋아요 토글 에러", e);
        } finally {
            setBusy(false);
        }
    };

    // 재생 시간 업데이트 로직 (유지)
    useEffect(() => {
        let timer;
        if (isPlay) {
            timer = setInterval(() => {
                if (!isAiMix && player && typeof player.getCurrentTime === 'function') {
                    setCurrentTime(player.getCurrentTime());
                    setDuration(player.getDuration());
                }
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [player, isPlay, isAiMix]);

    // [추가] 재생바 클릭/드래그 이동 함수
    const handleSeek = (e) => {
        const seekTo = parseFloat(e.target.value);
        if (!isAiMix && player && typeof player.seekTo === 'function') {
            player.seekTo(seekTo, true); // true는 유저가 드래그 중일 때도 즉시 이동함을 의미
            setCurrentTime(seekTo);
        }
    };

    const formatTime = (time) => {
        if (!time) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const togglePlay = () => {
        if (isAiMix) {
            setIsPlay(!isPlay);
        } else if (player) {
            isPlay ? player.pauseVideo?.() : player.playVideo?.();
            setIsPlay(!isPlay);
        }
    };

    if (!currentTrack) return null;

    const coverImage = isAiMix 
        ? (item?.track_image_url || item?.cover_url || "")
        : `https://img.youtube.com/vi/${v_id}/maxresdefault.jpg`;

    return (
        <div className="musicsongplay_wrap">
            <div className="container">
                <div className="ms_header">
                    <div className="msheader_content">
                        <button className="back_btn" onClick={() => navigate(-1)}><img src={back_btn} alt="back" /></button>
                        <h1 className="title">Music</h1>
                        <button className="edit_btn" onClick={()=>setIsPopupOpen(true)}><img src={edit_btn} alt="edit" /></button>
                    </div>
                </div>

                <div className="ms_main">
                    <div className="ms_cover">
                        <img src={coverImage} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                    </div>
                    
                    <div className="ms_detail">
                        <div className="song_detail">
                            <h1>{item?.title || item?.track_name || "제목 없음"}</h1>
                            <p>{item?.artist || item?.artist_name || "아티스트 미상"}</p>
                        </div>

                        <div className="heart_btn" onClick={onClickHeart} style={{ cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
                            <img src={liked ? heart_icon : emptyheart_icon} alt="like" style={{ width: '28px' }} />
                        </div>
                    </div>

                    {/* [기존 디자인 유지 + 기능 추가] */}
                    <div className="playing" style={{ position: 'relative' }}> {/* 부모에 relative 추가 */}
                        
                        {/* 1. 기능 담당: 디자인은 완벽히 투명하게 숨기고 기존 디자인 위에 겹침 */}
                        <input 
                            type="range" 
                            min="0" 
                            max={duration || 0} 
                            value={currentTime || 0} 
                            onChange={handleSeek}
                            style={{
                                width: '100%',
                                cursor: 'pointer',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                opacity: 0, // 완전 투명 (디자인 안 보임)
                                zIndex: 10,  // 기존 디자인 위에 배치
                                margin: 0,
                                padding: 0
                            }}
                        />

                        {/* 2. 기존 디자인 담당: HTML 구조와 클래스명 유지 */}
                        <div className="playing_bar">
                            <div className="playing_progress" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}></div>
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
                        <img src={isPlay ? music_play : music_stop} alt="play" />
                    </button>
                    
                    <button className="btn" onClick={() => next()}>
                        <img src={next_btn} alt="next" />
                    </button>
                    
                    <button className="btn" onClick={() => navigate("/music/songlyrics", { state: { trackId: t_id || v_id || d_id } })}>
                        <img src={lyrics_btn} alt="lyrics" />
                    </button>
                </div>
                {isPopupOpen && <Popup onClose={()=>setIsPopupOpen(false)}/>}
            </div>
        </div>
    );
};

export default Music_songplay;