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
    const { currentTrack, isPlay, player } = useMusic(); 
    
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const trackData = currentTrack?.track || currentTrack;
    const t_id = String(trackData?.track_id || "");
    const d_id = String(trackData?.id || "");
    const v_id = String(trackData?.youtube_video_id || trackData?.video_id || "");

    useEffect(() => {
        const syncLikeStatus = async () => {
            const profileId = localStorage.getItem('profile_id');
            const token = localStorage.getItem('access_token');
            const BASE_URL = import.meta.env.VITE_API_BASE_URL;

            if (!profileId) return;

            const myCurrentIds = [t_id, d_id, v_id].filter(id => id !== "");

            try {
                const res = await axios.get(`${BASE_URL}/user/mylist/${profileId}`, {
                    headers: { 
                        "Authorization": `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "69420"
                    }
                });

                const mylist = res.data.mylist || res.data; 
                
                console.log("동기화 시도 중 - 실제 리스트 데이터:", mylist);

                if (Array.isArray(mylist)) {
                    const isFound = mylist.some(item => {
                        const itemTrackId = String(item.track_id || "");
                        const itemId = String(item.id || "");
                        const itemVideoId = String(item.youtube_video_id || item.video_id || "");
                        const serverIds = [itemTrackId, itemId, itemVideoId].filter(id => id !== "");
                        
                        return myCurrentIds.some(myId => serverIds.includes(myId));
                    });
                    
                    setLiked(isFound);
                    console.log("최종 하트 상태:", isFound);
                }
            } catch (error) {
                console.error("좋아요 동기화 실패:", error);
            }
        };

        syncLikeStatus();
    }, [t_id, v_id]);


    const onClickHeart = async () => {
        if (busy) return;
        const profileId = localStorage.getItem('profile_id');
        const contentId = t_id || v_id || d_id;

        try {
            setBusy(true);
            const res = await toggleLike({ profileId, contentId });
            const status = (typeof res === "string" ? res : res?.status) || res?.data?.status;

            if (status === "unliked") {
                setLiked(false);
            } else if (status === "liked") {
                setLiked(true);
            } else {
                setLiked(!liked);
            }
        } catch (e) {
            console.error("좋아요 토글 에러", e);
        } finally {
            setBusy(false);
        }
    };

    // --- 유튜브 플레이어 및 포맷팅 로직 ---
    useEffect(() => {
        let timer;
        if (player && isPlay) {
            timer = setInterval(() => {
                if (typeof player.getCurrentTime === 'function') {
                    setCurrentTime(player.getCurrentTime());
                    setDuration(player.getDuration());
                }
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [player, isPlay]);

    const formatTime = (time) => {
        if (!time) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    if (!v_id) return null;

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
                        <img src={`https://img.youtube.com/vi/${v_id}/maxresdefault.jpg`} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                    </div>
                    
                    <div className="ms_detail">
                        <div className="song_detail">
                            <h1>{trackData?.title || trackData?.track_name || "제목 없음"}</h1>
                            <p>{trackData?.artist || trackData?.artist_name || "아티스트 미상"}</p>
                        </div>

                        <div className="heart_btn" onClick={onClickHeart} style={{ cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
                            <img src={liked ? heart_icon : emptyheart_icon} alt="like" style={{ width: '28px' }} />
                        </div>
                    </div>

                    <div className="playing">
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
                    <button className="btn btn3" onClick={() => isPlay ? player.pauseVideo() : player.playVideo()}>
                        <img src={isPlay ? music_play : music_stop} alt="play" />
                    </button>
                    <button className="btn"><img src={next_btn} alt="next" /></button>
                    <button className="btn" onClick={() => navigate("/music/songlyrics", { state: { trackId: t_id || v_id } })}>
                        <img src={lyrics_btn} alt="lyrics" />
                    </button>
                </div>
                {isPopupOpen && <Popup onClose={()=>setIsPopupOpen(false)}/>}
            </div>
        </div>
    );
};

export default Music_songplay;