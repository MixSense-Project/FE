import React, { createContext, useContext, useMemo, useState, useCallback, useRef, useEffect } from "react";

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlay, setIsPlay] = useState(false);
  const [player, setPlayer] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // 재생 시작 시각 추적 (렌더링에 영향을 주지 않기 위해 useRef 사용)
  const playStartTimeRef = useRef(null);

  // --- [로그 전송 함수] ---
  const sendPlayLog = useCallback(async () => {
    // 1. 유효성 검사
    if (!currentTrack || !playStartTimeRef.current) return;

    const msPlayed = Math.floor(Date.now() - playStartTimeRef.current);
    
    // 1초 미만 재생은 데이터 가치가 없으므로 스킵
    if (msPlayed < 1000) {
      console.log(`[Log Skip] 재생 시간이 너무 짧음 (${msPlayed}ms). 전송을 건너뜁니다.`);
      return;
    }

    const token = localStorage.getItem('access_token');
    
    /**
     * [CORS 해결] 
     * vite.config.js의 proxy를 타기 위해 전체 URL이 아닌 상대 경로 사용
     */
    const apiUrl = "/api/logs/play";

    /**
     * [500 에러 해결] 
     * 포스트맨 성공 케이스에 맞춰 track_id를 반드시 문자열(String)로 변환
     */
    const logData = {
      track_id: String(currentTrack.id || currentTrack.track_id || ""),
      ms_played: msPlayed,
    };

    try {
      console.log(`%c[Log Attempt] 🎵 재생 기록 전송 시도`, "color: #9E9E9E; font-weight: bold;");
      console.log("데이터:", logData);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(logData),
      });

      // 서버 응답 확인
      if (!response.ok) {
        // 500 에러 등 발생 시 서버의 상세 메시지 확인
        const errorDetail = await response.text();
        console.error(`[Log Error] 서버 응답 오류 (${response.status}):`, errorDetail);
        return;
      }

      const result = await response.json();
      
      // 서버 응답 구조에 맞춰 성공 로그 출력
      if (result.status === "success" || response.ok) {
        console.log(`%c[Log Success] ✅ 서버 기록 완료! (${msPlayed}ms)`, "color: #4CAF50; font-weight: bold");
      }

    } catch (error) {
      console.error("[Log Error] API 호출 중 예외 발생 (네트워크/프록시 확인):", error);
    }
  }, [currentTrack]);

  // --- [재생 상태 변화 감지] ---
  useEffect(() => {
    if (isPlay) {
      // 재생 시작 시점 기록
      playStartTimeRef.current = Date.now();
      console.log(`%c[Player] ▶️ 재생 시작: ${currentTrack?.title || 'Unknown'}`, "color: #2196F3");
    } else {
      // 일시정지 시 즉시 로그 전송 후 Ref 초기화
      if (playStartTimeRef.current) {
        console.log("%c[Player] ⏸️ 일시정지: 로그 전송을 시작합니다.", "color: #FF9800");
        sendPlayLog();
        playStartTimeRef.current = null;
      }
    }
  }, [isPlay, sendPlayLog, currentTrack?.title]);

  // --- [곡 변경 및 언마운트 시 처리] ---
  useEffect(() => {
    return () => {
      // 곡이 바뀌기 직전까지의 시간을 정산해서 전송
      if (playStartTimeRef.current) {
        sendPlayLog();
      }
    };
  }, [currentTrack, sendPlayLog]);

  // --- [재생 컨트롤러 함수들] ---
  const playQueue = useCallback((tracks, startIndex = 0) => {
    const safe = Array.isArray(tracks) ? tracks.filter(Boolean) : [];
    if (safe.length === 0) return;

    const i = Math.max(0, Math.min(startIndex, safe.length - 1));
    setQueue(safe);
    setCurrentIndex(i);
    setCurrentTrack(safe[i]);
    setIsPlay(true);
  }, []);

  const next = useCallback(() => {
    if (queue.length === 0) return;
    sendPlayLog(); // 다음 곡 가기 전 기록
    
    setCurrentIndex((prevIdx) => {
      const ni = prevIdx + 1;
      if (ni >= queue.length) return prevIdx; 
      setCurrentTrack(queue[ni]);
      return ni;
    });
  }, [queue, sendPlayLog]);

  const prev = useCallback(() => {
    if (queue.length === 0) return;
    sendPlayLog(); // 이전 곡 가기 전 기록

    setCurrentIndex((prevIdx) => {
      const pi = prevIdx - 1;
      if (pi < 0) return prevIdx;
      setCurrentTrack(queue[pi]);
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