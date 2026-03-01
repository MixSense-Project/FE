import React, { useEffect } from 'react';
import YouTube from 'react-youtube';
import { useMusic } from '../context/MusicContext';

const YouTubePlayer = () => {
    const { currentTrack, setPlayer, setIsPlay, player } = useMusic();
    
    // 비디오 ID 추출
    const videoId = currentTrack?.youtube_video_id || currentTrack?.track?.youtube_video_id || currentTrack?.video_id;

    // 곡이 바뀔 때마다 플레이어 제어
    useEffect(() => {
        // player 객체가 있고, 실제로 loadVideoById 함수가 존재할 때만 실행
        if (player && typeof player.loadVideoById === 'function' && videoId) {
            try {
                player.loadVideoById(videoId);
                player.playVideo();
                setIsPlay(true);
            } catch (error) {
                console.error("재생 중 오류 발생:", error);
            }
        }
    }, [videoId]); // player를 의존성에서 제외하여 무한 리렌더링 방지

    if (!videoId) return null;

    const opts = {
        height: '0',
        width: '0',
        playerVars: {
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
        },
    };

    return (
        <div style={{ display: 'none' }}>
            <YouTube 
                videoId={videoId} 
                opts={opts} 
                onReady={(e) => {
                    setPlayer(e.target); // 여기서 player 객체가 Context에 저장됨
                }} 
                onStateChange={(e) => {
                    setIsPlay(e.data === 1);
                }} 
                onError={(e) => console.error("YouTube Player Error:", e.data)}
            />
        </div>
    );
};

export default YouTubePlayer;