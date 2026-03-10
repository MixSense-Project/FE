import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import logo_g from '../../assets/img/AIDJ/logo_g.svg';
import play_icon from '../../assets/img/AIDJ/play_icon.svg';
import cancel_icon from '../../assets/img/AIDJ/cancel_icon.svg';
import Playlist_add from "../../components/Ai_Dj/Playlist_add.jsx";

const Ai_Dj_Result = () => {
    const location = useLocation();
    const { mixData, songs } = location.state || {}; 
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    
    // 상태 관리: 플레이리스트 목록 및 선택된 ID
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // 🎵 오디오 재생 관련 상태 및 Ref
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // 컴포넌트 언마운트 시 오디오 정지 (메모리 누수 방지)
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // 재생/일시정지 토글 함수
    const handlePlayPause = () => {
        if (!mixData?.mix_audio_url) return;

        // 오디오 객체가 없으면 새로 생성
        if (!audioRef.current) {
            audioRef.current = new Audio(mixData.mix_audio_url);
            // 노래가 끝났을 때 상태 업데이트
            audioRef.current.onended = () => setIsPlaying(false);
        }

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleSheet = () => {
        setIsSheetOpen(!isSheetOpen);
        if (!isSheetOpen) {
            fetchPlaylists(); // 시트를 열 때 목록 조회
        }
    };

    // 1. 내 플레이리스트 목록 조회 API (GET /api/playlists)
    const fetchPlaylists = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/playlists`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPlaylists(response.data); 
        } catch (error) {
            console.error("플레이리스트 목록 조회 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 2. 선택한 플레이리스트에 믹스곡 추가 API (POST /api/playlists/{id}/tracks)
    const handleAddToPlaylist = async () => {
        if (!selectedPlaylistId) {
            alert("저장할 플레이리스트를 선택해주세요!");
            return;
        }

        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/playlists/${selectedPlaylistId}/tracks`,
                { mix_id: mixData.mix_id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200 || response.status === 201) {
                alert("플레이리스트에 믹스곡이 추가되었습니다!");
                toggleSheet();
            }
        } catch (error) {
            console.error("추가 실패:", error);
            alert("플레이리스트 추가 중 에러가 발생했습니다.");
        }
    };

    return (
        <div className="aidjresult_wrap">
            <div className="container">
                <Header />
                <div className="step"><div className="line"></div></div>
                <div className="result_header">
                    <h1>AI mix creation complete!</h1>
                    <p>Enjoy your unique mixing sense.</p>
                 </div>
                <div className="result_song">
                    <div className="rs_cover">
                        <div className="rs_logo"><img src={logo_g} alt="" /></div>
                        {/* 🔘 재생/정지 버튼으로 변경 */}
                        <button className={`play_btn ${isPlaying ? "playing" : ""}`} onClick={handlePlayPause}>
                            <img 
                                src={play_icon} 
                                alt="play/pause" 
                                style={{ filter: isPlaying ? "hue-rotate(90deg)" : "none" }} // 재생 중일 때 시각적 피드백 (선택사항)
                            />
                        </button>
                    </div>
                    <div className="rs_text">
                        {songs ? `${songs.left.title} X ${songs.right.title} AI mix` : "AI Mix Complete"}
                    </div>
                </div>
                <div className="btn_container">
                    <button type="button" className="addpl_btn" onClick={toggleSheet} >Add to playlist</button>
                    <Link to='/ai_dj'><button className="backdj_btn" type="button">Back to AI DJ</button></Link>
                </div>
            </div>

            {/* 바텀 시트 영역 */}
            {isSheetOpen && (
                <div className="bottomsheet_wrap">
                    <div id="sheet_container">
                        <header>
                            <img src={cancel_icon} alt="닫기" onClick={toggleSheet}/><p>Add to Playlist</p>
                        </header>
                        <main style={{ overflowY: 'auto', maxHeight: '400px' }}>
                            {isLoading ? (
                                <p style={{ textAlign: 'center', padding: '20px' }}>Loading playlists...</p>
                            ) : playlists.length > 0 ? (
                                playlists.map((list) => (
                                    <div 
                                        key={list.id} 
                                        onClick={() => setSelectedPlaylistId(list.id)}
                                        style={{
                                            cursor: 'pointer',
                                            border: selectedPlaylistId === list.id ? '2px solid #BC29EC' : '1px solid transparent',
                                            borderRadius: '8px',
                                            marginBottom: '8px'
                                        }}
                                    >
                                        <Playlist_add playlistData={list} />
                                    </div>
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', padding: '20px' }}>No playlists found.</p>
                            )}
                        </main>
                        <button className="select_btn" onClick={handleAddToPlaylist}>Confirm Selection</button>
                    </div>
                </div>
            )}
            <Nav />
        </div>
    );
};

export default Ai_Dj_Result;