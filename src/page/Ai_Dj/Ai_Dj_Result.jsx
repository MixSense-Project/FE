import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import logo_g from '../../assets/img/AIDJ/logo_g.svg'
import play_icon from '../../assets/img/AIDJ/play_icon.svg'
import cancel_icon from '../../assets/img/AIDJ/cancel_icon.svg'
import Playlist_add from "../../components/Ai_Dj/playlist_add";


const Ai_Dj_Result = () => {

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const toggleSheet = () => {
        setIsSheetOpen(!isSheetOpen);
    }
    return (
        <div className="aidjresult_wrap">
            <div className="container">
                <Header />
                <div className="step">
                    <div className="line"></div>
                </div>
                <div className="result_header">
                    <h1>AI mix creation complete!</h1>
                    <p>Enjoy your unique mixing sense.</p>
                 </div>
                <div className="result_song">
                    <div className="rs_cover">
                        <div className="rs_logo">
                            <img src={logo_g} alt="" />
                        </div>
                        <button className="play_btn">
                            <img src={play_icon} alt="" />
                        </button>
                    </div>
                    <div className="rs_text">Musix X Musix AI mix</div>
                </div>
                <div className="btn_container">
                    <button type="button" className="addpl_btn" onClick={toggleSheet} >Add to playlist</button>
                    <Link to='/ai_dj'>
                        <button className="backdj_btn" type="button">Back to AI DJ</button>
                    </Link>
                </div>
            </div>
            {isSheetOpen && (
                <div className="bottomsheet_wrap">
                    <div id="sheet_container">
                        <header>
                            <img src={cancel_icon} alt="" onClick={toggleSheet}/>
                            <p>Add to Playlist</p>
                        </header>
                        <main>
                            <Playlist_add/>
                            <Playlist_add/>
                            <Playlist_add/>
                            <Playlist_add/>
                            <Playlist_add/>
                        </main>
                        <button className="select_btn" onClick={toggleSheet}>
                            Select
                        </button>
                    </div>
                </div>
            )}
            <Nav />
        </div>
    );
};

export default Ai_Dj_Result;
