import React from 'react'
import under from '../../assets/img/Music/under.svg';
import before_btn from "../../assets/img/Music/before.svg";
import play_btn from "../../assets/img/Music/play_btn.svg";
import next_btn from "../../assets/img/Music/next.svg";


const Music_songlyrics = () => {
    return (
        <div className='musicsonglyrics_wrap'>
            <div className="container">
                <div className="ms_header">
                    <div className="msheader_content">
                        <button className="underbtn">
                            <img src={under} alt="back" />
                        </button>
                        <div className="song_detail">
                            <h1>Song</h1>
                            <p>Artist</p>
                        </div>
                    </div>
                </div>
                <div className="main">
                    <div className="lyrics">
                        <p>
                            oh, oh, oh <br />
                            oh, oh, oh <br />
                            oh, oh, oh <br />
                            oh, oh, oh <br />
                            oh, oh, oh
                        </p>
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
                    <div className="btns">
                        <button type="button" className="btn btn2">
                            <img src={before_btn} alt="before" />
                        </button>

                        <button type="button" className="btn btn3">
                            <img src={play_btn} alt="play" />
                        </button>

                        <button type="button" className="btn btn4">
                            <img src={next_btn} alt="next" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Music_songlyrics
