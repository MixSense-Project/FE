import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Nav from '../../components/Nav'
import play_btn from '../../assets/img/library/play_btn.svg'
import random_btn from '../../assets/img/library/random_btn.svg'
import plus_btn from '../../assets/img/library/plus_btn.svg'
import Library_deletesongs from '../../components/Library/Library_deletesongs'
const Library_playlist = () => {
    const navigate = useNavigate();
    return (
        <div className='libraryplaylist_wrap'>
            <div className="container">
                <Header />
                <div className="pl_header">
                    <div className="pl_h_left">
                        <div className="pl_h_cover"></div>
                    </div>
                    <div className="pl_h_right">
                        <p className="pl_h_name">myplaylist</p>
                        <p className="pl_h_user">username</p>
                        <div className="pl_h_btns">
                            <button className="pl_h_playbtn">
                                <img src={play_btn} alt="" />
                            </button>
                            <button className="pl_h_randombtn">
                                <img src={random_btn} alt="" />
                            </button>
                            <button className="pl_h_plusbtn" type="button" onClick={() => navigate("/library/add/playlist")}>
                                <img src={plus_btn} alt="" />
                            </button>
                        </div>
                    </div>
                </div>
                <Library_deletesongs />
            </div>
            <Nav />
        </div>
    )
}

export default Library_playlist
