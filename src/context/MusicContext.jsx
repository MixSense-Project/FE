import React, { createContext, useContext, useState } from 'react';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlay, setIsPlay] = useState(false);
    const [player, setPlayer] = useState(null); // 유튜브 플레이어 인스턴스 저장

    return (
        <MusicContext.Provider value={{ 
            currentTrack, setCurrentTrack, 
            isPlay, setIsPlay, 
            player, setPlayer 
        }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => useContext(MusicContext);