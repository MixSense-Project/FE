import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import logo_g from '../../assets/img/AIDJ/logo_g.svg';
import play_icon from '../../assets/img/AIDJ/play_icon.svg';
import pause_icon from '../../assets/img/AIDJ/pause_icon.svg'; // ✅ 일시정지 아이콘 추가
import cancel_icon from '../../assets/img/AIDJ/cancel_icon.svg';

// 실제 사용 중인 플레이리스트 컴포넌트 임포트
import Library_myplaylist from "../../components/Library/Library_myplaylist";

const Ai_Dj_Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { mixData, songs } = location.state || {}; 
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // 🎵 오디오 재생 상태
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem("access_token");

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handlePlayPause = () => {
        if (!mixData?.mix_audio_url) return;
        if (!audioRef.current) {
            audioRef.current = new Audio(mixData.mix_audio_url);
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
            fetchPlaylists(); 
        }
    };

    const fetchPlaylists = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/playlists`, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "69420",
                }
            });
            const data = response.data;
            setPlaylists(Array.isArray(data) ? data : (data.playlists || []));
        } catch (error) {
            console.error("플레이리스트 목록 조회 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToPlaylist = async () => {
        if (!selectedPlaylistId) {
            alert("저장할 플레이리스트를 선택해주세요!");
            return;
        }

        try {
            const response = await axios.post(
                `${BASE_URL}/api/playlists/${selectedPlaylistId}/tracks`,
                { mix_id: mixData.mix_id },
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "69420"
                    } 
                }
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
                        <button className={`play_btn ${isPlaying ? "playing" : ""}`} onClick={handlePlayPause}>
                            {/* ✅ 재생 상태에 따라 아이콘 변경 */}
                            <img src={isPlaying ? pause_icon : play_icon} alt={isPlaying ? "pause" : "play"} />
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

            {isSheetOpen && (
                <div className="bottomsheet_wrap">
                    <div id="sheet_container">
                        <header>
                            <img src={cancel_icon} alt="닫기" onClick={toggleSheet}/><p>Add to Playlist</p>
                        </header>
                        <main>
                            {isLoading ? (
                                <p style={{ textAlign: 'center', padding: '20px', color: '#fff' }}>Loading playlists...</p>
                            ) : playlists.length > 0 ? (
                                playlists.map((list) => (
                                    <div 
                                        key={list.id} 
                                        onClick={() => setSelectedPlaylistId(list.id)}
                                        className={`playlist_item_container ${selectedPlaylistId === list.id ? 'selected' : ''}`}
                                    >
                                        <Library_myplaylist 
                                            id={list.id}
                                            title={list.title}
                                            coverUrl={list.cover_url || list.thumbnail} 
                                            onClick={() => setSelectedPlaylistId(list.id)}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', padding: '20px', color: '#fff' }}>No playlists found.</p>
                            )}
                        </main>
                        <button className="select_btn" onClick={handleAddToPlaylist}>Select</button>
                    </div>
                </div>
            )}
            <Nav />
        </div>
    );
};

export default Ai_Dj_Result;