import React, { createContext, useContext, useMemo, useState, useCallback, useRef, useEffect } from "react";

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlay, setIsPlay] = useState(false);
  const [player, setPlayer] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // 재생 시작 시점 기록용 (렌더링과 무관하게 값을 유지하기 위해 useRef 사용)
  const playStartTimeRef = useRef(null);

  // --- [로그 전송 로직] ---
  const sendPlayLog = useCallback(async () => {
    if (!currentTrack || !playStartTimeRef.current) return;

    const msPlayed = Math.floor(Date.now() - playStartTimeRef.current);
    
    // 1초 미만은 의미 없는 데이터로 간주하고 전송하지 않음
    if (msPlayed < 1000) return;

    const token = localStorage.getItem('access_token');
    const apiUrl = "/api/logs/play"; // Vite Proxy 설정을 이용한 상대 경로

    const logData = {
      track_id: String(currentTrack.id || currentTrack.track_id || ""),
      ms_played: msPlayed,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(logData),
      });

      if (response.ok) {
        console.log(`%c[Log Success] ✅ 기록 완료: ${msPlayed}ms`, "color: #4CAF50; font-weight: bold");
      }
    } catch (error) {
      console.error("[Log Error] 전송 실패:", error);
    }
  }, [currentTrack]);

  // --- [재생 상태 감시 이펙트] ---
  useEffect(() => {
    if (isPlay) {
      // 재생 시작 시점 기록
      playStartTimeRef.current = Date.now();
    } else {
      // 일시정지 시 지금까지 들은 시간 전송
      if (playStartTimeRef.current) {
        sendPlayLog();
        playStartTimeRef.current = null;
      }
    }
  }, [isPlay, sendPlayLog]);

  // --- [기존 로직 유지 + 로그 전송 추가] ---
  const playQueue = useCallback((tracks, startIndex = 0) => {
    const safe = Array.isArray(tracks) ? tracks.filter(Boolean) : [];

    if (safe.length === 0) {
      setQueue([]);
      setCurrentIndex(-1);
      setCurrentTrack(null);
      setIsPlay(false);
      return;
    }

    const i = Math.max(0, Math.min(startIndex, safe.length - 1));
    setQueue(safe);
    setCurrentIndex(i);
    setCurrentTrack(safe[i]);
    setIsPlay(true);
  }, []);

  const next = useCallback(() => {
    // 곡이 바뀌기 전 현재까지 재생한 기록 전송
    sendPlayLog();

    setCurrentIndex((prev) => {
      if (!queue || queue.length === 0) return -1;

      const ni = prev + 1;
      if (ni >= queue.length) {
        setIsPlay(false);
        return prev;
      }
      setCurrentTrack(queue[ni]);
      setIsPlay(true);
      return ni;
    });
  }, [queue, sendPlayLog]);

  const prev = useCallback(() => {
    // 곡이 바뀌기 전 현재까지 재생한 기록 전송
    sendPlayLog();

    setCurrentIndex((prevIdx) => {
      if (!queue || queue.length === 0) return -1;

      const pi = prevIdx - 1;
      if (pi < 0) return prevIdx;

      setCurrentTrack(queue[pi]);
      setIsPlay(true);
      return pi;
    });
  }, [queue, sendPlayLog]);

  const value = useMemo(
    () => ({
      currentTrack,
      setCurrentTrack,
      isPlay,
      setIsPlay,
      player,
      setPlayer,
      queue,
      currentIndex,
      playQueue,
      next,
      prev,
    }),
    [currentTrack, isPlay, player, queue, currentIndex, playQueue, next, prev]
  );

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export const useMusic = () => useContext(MusicContext);