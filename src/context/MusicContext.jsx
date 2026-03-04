import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlay, setIsPlay] = useState(false);
  const [player, setPlayer] = useState(null);

  // 큐/연속재생
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const playQueue = useCallback((tracks, startIndex = 0) => {
    const safe = Array.isArray(tracks) ? tracks.filter(Boolean) : [];
    if (safe.length === 0) {
      setQueue([]);
      setCurrentIndex(-1);
      setCurrentTrack(null);
      return;
    }

    const i = Math.max(0, Math.min(startIndex, safe.length - 1));
    setQueue(safe);
    setCurrentIndex(i);
    setCurrentTrack(safe[i]);
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((prev) => {
      if (!queue || queue.length === 0) return -1;
      const ni = prev + 1;
      if (ni >= queue.length) return prev; 
      setCurrentTrack(queue[ni]);
      return ni;
    });
  }, [queue]);

  const prev = useCallback(() => {
    setCurrentIndex((prevIdx) => {
      if (!queue || queue.length === 0) return -1;
      const pi = prevIdx - 1;
      if (pi < 0) return prevIdx;
      setCurrentTrack(queue[pi]);
      return pi;
    });
  }, [queue]);

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