import React, { createContext, useContext, useMemo, useState, useCallback, useRef, useEffect } from "react";

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlay, setIsPlay] = useState(false);
  const [player, setPlayer] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const playStartTimeRef = useRef(null);

  // --- [1. Autoplay API 호출 로직] ---
  const fetchAutoplay = useCallback(async (trackId) => {
    console.log(`%c[Autoplay] 📡 추천 API 호출 시도 (ID: ${trackId})`, "color: #2196F3; font-weight: bold");
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.warn("[Autoplay] ⚠️ 토큰이 없습니다.");
      return [];
    }

    // 포스트맨에서 확인한 경로와 파라미터 (current_track_id)
    const apiUrl = `/api/ai/recommend/autoplay?current_track_id=${trackId}&k=5`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (response.ok) {
        const data = await response.json();
        const newTracks = Array.isArray(data) ? data : (data.tracks || []);
        console.log(`%c[Autoplay] ✅ 추천 곡 ${newTracks.length}개 로드 성공`, "color: #2196F3; font-weight: bold", newTracks);
        return newTracks;
      } else {
        console.error(`[Autoplay] ❌ 서버 응답 에러: ${response.status}`);
        return [];
      }
    } catch (error) {
      console.error("[Autoplay] ❌ 네트워크 오류:", error);
      return [];
    }
  }, []);

  // --- [2. 재생 로그 전송 로직] ---
  const sendPlayLog = useCallback(async () => {
    if (!currentTrack || !playStartTimeRef.current) return;
    const msPlayed = Math.floor(Date.now() - playStartTimeRef.current);
    if (msPlayed < 1000) return;

    const token = localStorage.getItem('access_token');
    const logData = {
      track_id: String(currentTrack.id || currentTrack.track_id || ""),
      ms_played: msPlayed,
    };

    try {
      await fetch("/api/logs/play", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(logData),
      });
      console.log(`%c[Log] ✅ 기록 완료: ${msPlayed}ms`, "color: #4CAF50");
    } catch (e) { console.error("[Log] 전송 실패", e); }
  }, [currentTrack]);

  // --- [3. 재생 상태 감시] ---
  useEffect(() => {
    if (isPlay) {
      playStartTimeRef.current = Date.now();
    } else {
      if (playStartTimeRef.current) {
        sendPlayLog();
        playStartTimeRef.current = null;
      }
    }
  }, [isPlay, sendPlayLog]);

  // --- [4. 재생 컨트롤 로직 (핵심 수정)] ---
  const playQueue = useCallback((tracks, startIndex = 0) => {
    const safe = Array.isArray(tracks) ? tracks.filter(Boolean) : [];
    setQueue(safe);
    setCurrentIndex(startIndex);
    setCurrentTrack(safe[startIndex]);
    setIsPlay(true);
  }, []);

  const next = useCallback(async () => {
    console.log("%c[Control] ⏭️ Next 호출", "font-weight: bold");
    sendPlayLog();

    // ID 확보 (여러 구조 대응)
    const currentId = currentTrack?.id || currentTrack?.track_id || currentTrack?.track?.id;
    const nextIndex = currentIndex + 1;

    // 큐가 비어있거나 마지막 곡일 경우 -> 무조건 Autoplay API 호출
    if (queue.length === 0 || nextIndex >= queue.length) {
      console.log("%c[System] 💡 큐가 비었거나 마지막입니다. 자동 재생을 요청합니다.", "color: #9C27B0");
      
      if (!currentId) {
        console.warn("[System] 현재 곡 ID를 찾을 수 없어 API를 호출할 수 없습니다.");
        return;
      }

      const newTracks = await fetchAutoplay(currentId);

      if (newTracks && newTracks.length > 0) {
        setQueue(newTracks); 
        setCurrentIndex(0);
        setCurrentTrack(newTracks[0]);
        setIsPlay(true);
      } else {
        console.warn("[System] 추천 곡이 없습니다.");
        setIsPlay(false);
      }
      return;
    }

    // 큐에 다음 곡이 있는 경우
    setCurrentIndex(nextIndex);
    setCurrentTrack(queue[nextIndex]);
    setIsPlay(true);
  }, [queue, currentIndex, currentTrack, sendPlayLog, fetchAutoplay]);

  const prev = useCallback(() => {
    sendPlayLog();
    if (currentIndex > 0) {
      const pi = currentIndex - 1;
      setCurrentIndex(pi);
      setCurrentTrack(queue[pi]);
      setIsPlay(true);
    }
  }, [queue, currentIndex, sendPlayLog]);

  const value = useMemo(() => ({
    currentTrack, setCurrentTrack, isPlay, setIsPlay, player, setPlayer, queue, currentIndex, playQueue, next, prev,
  }), [currentTrack, isPlay, player, queue, currentIndex, playQueue, next, prev]);

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export const useMusic = () => useContext(MusicContext);