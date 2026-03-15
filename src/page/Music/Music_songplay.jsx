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
    
    // [수정] next, setIsPlay 추가 추출
    const { currentTrack, isPlay, setIsPlay, player, next } = useMusic(); 
    
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // 데이터 구조 정리
    const item = currentTrack?.track || currentTrack;
    const t_id = String(item?.track_id || "");
    const d_id = String(item?.id || "");
    const v_id = String(item?.youtube_video_id || item?.video_id || "");
    
    // AI Mix 여부 판단 (Musicplay와 동일 로직)
    const mixAudioUrl = currentTrack?.mix_audio_url || currentTrack?.audio_url || item?.mix_audio_url || null;
    const isAiMix = (!!mixAudioUrl && !v_id);

    // 좋아요 동기화 로직
    useEffect(() => {
        const syncLikeStatus = async () => {
            const profileId = localStorage.getItem('profile_id');
            const token = localStorage.getItem('access_token');
            const BASE_URL = import.meta.env.VITE_API_BASE_URL;

            if (!profileId) return;

            // 곡이 바뀔 때마다 일단 false로 초기화 (깜빡임 방지용)
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
    }, [t_id, v_id, d_id]); // d_id 추가하여 곡 변경 감지 강화


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

    // 재생 시간 업데이트 로직
    useEffect(() => {
        let timer;
        if (isPlay) {
            timer = setInterval(() => {
                if (!isAiMix && player && typeof player.getCurrentTime === 'function') {
                    setCurrentTime(player.getCurrentTime());
                    setDuration(player.getDuration());
                } else if (isAiMix) {
                    // AI Mix의 경우 Context에서 관리하는 오디오 객체나 전역 객체로부터 시간을 가져와야 함
                    // (필요 시 Context에 currentTime 상태를 추가하여 공유하는 것이 좋습니다)
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
            setIsPlay(!isPlay);
        } else if (player) {
            isPlay ? player.pauseVideo?.() : player.playVideo?.();
            setIsPlay(!isPlay);
        }
    };

    if (!currentTrack) return null;

    // 커버 이미지 설정
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
                    {/* 이전 곡 기능 필요 시 context에서 prev 가져와 연결 */}
                    <button className="btn"><img src={before_btn} alt="before" /></button>
                    
                    <button className="btn btn3" onClick={togglePlay}>
                        <img src={isPlay ? music_play : music_stop} alt="play" />
                    </button>
                    
                    {/* [수정] 다음 곡 연동 */}
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