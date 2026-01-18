import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/Nav";
import back_btn from "../../assets/img/Header/back_btn.svg";
import edit_btn from "../../assets/img/library/edit_btn.svg";
import heart_btn from "../../assets/img/Music/heart_btn.svg";
import random_btn from "../../assets/img/Music/random_btn.svg";
import before_btn from "../../assets/img/Music/before.svg";
import play_btn from "../../assets/img/Music/play_btn.svg";
import next_btn from "../../assets/img/Music/next.svg";
import lyrics_btn from "../../assets/img/Music/lyrics.svg";
import share from '../../assets/img/Music/share.svg';
import aidj from '../../assets/img/Music/aidj.svg';
import plus_btn from '../../assets/img/library/plus_btn.svg';
const Music_songplay = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleBack = () => navigate(-1);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const closeMenu = () => setIsMenuOpen(false);

    const goToAiDj = () => {
        closeMenu();
        navigate("/ai_dj");
    };

    const onShare = async () => {
        closeMenu();
        try {
            if (navigator.share) {
                await navigator.share({
                    title: "Song",
                    text: "Check this song!",
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("링크가 복사됐어요!");
            }
        } catch (e) {
            // 사용자가 공유 취소한 경우도 여기로 들어올 수 있음
            console.log(e);
        }
    };

    const addToMyPlaylist = (name) => {
        closeMenu();
        alert(`${name}에 추가! (예시)`);
    };

    return (
        <div className="musicsongplay_wrap">
            <div className="container">
                <div className="ms_header">
                    <div className="msheader_content">
                        <button className="back_btn" onClick={handleBack}>
                            <img src={back_btn} alt="back" />
                        </button>

                        <h1 className="title">Music</h1>

                        <button className="edit_btn" onClick={toggleMenu}>
                            <img src={edit_btn} alt="edit" />
                        </button>

                        {isMenuOpen && (
                            <div className="ms_menu_overlay" onClick={closeMenu}>
                                <div className="ms_menu" onClick={(e) => e.stopPropagation()}>
                                    <button className="ms_menu_item menu_aidj" onClick={goToAiDj}>
                                        <span>Go to AI DJ</span>
                                        <span className="ms_menu_right">
                                            <img src={aidj} alt="" className="icon_aidj" />
                                        </span>
                                    </button>

                                    <button className="ms_menu_item menu_share" onClick={onShare}>
                                        <span>Share</span>
                                        <span className="ms_menu_right">
                                            <img src={share} alt="" className="icon_share" />
                                        </span>
                                    </button>

                                    {["myplaylist1", "myplaylist2", "myplaylist3", "myplaylist4", "myplaylist5"].map(
                                        (p) => (
                                            <button
                                                key={p}
                                                className="ms_menu_item menu_plus"
                                                onClick={() => addToMyPlaylist(p)}
                                            >
                                                <span>Add to '{p}'</span>
                                                <span className="ms_menu_right">
                                                    <img src={plus_btn} alt="" className="icon_plus" />
                                                </span>
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                <div className="ms_main">
                    <div className="ms_cover"></div>

                    <div className="ms_detail">
                        <div className="song_detail">
                            <h1>Song</h1>
                            <p>Artist</p>
                        </div>

                        <div className="heart_btn">
                            <img src={heart_btn} alt="like" />
                        </div>
                    </div>

                    <div className="playing">
                        <div className="playing_bar">
                            <div className="playing_progress"></div>
                        </div>
                    </div>

                    <div className="time">
                        <p className="time_start">1:03</p>
                        <p className="time_end">3:16</p>
                    </div>
                </div>

                <div className="ms_btns">
                    <button type="button" className="btn btn1">
                        <img src={random_btn} alt="random" />
                    </button>

                    <button type="button" className="btn btn2">
                        <img src={before_btn} alt="before" />
                    </button>

                    <button type="button" className="btn btn3">
                        <img src={play_btn} alt="play" />
                    </button>

                    <button type="button" className="btn btn4">
                        <img src={next_btn} alt="next" />
                    </button>

                    <button
                        type="button"
                        className="btn btn5"
                        onClick={() => navigate("/music/songlyrics")}
                    >
                        <img src={lyrics_btn} alt="lyrics" />
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Music_songplay;
