import React from 'react'
import heart_icon from '../../assets/img/library/heart.svg'
const Library_likesongs = () => {
    return (
        <div className='deletesongs_wrap'>
            <div className="c_pl_left">
                <div className="c_pl_cover"></div>
                <div className="song_detail">
                    <p className="c_song_name">Song</p>
                    <p className="c_artist_name"> Artist</p>
                </div>
            </div>
            <div className="heart">
                <img src={heart_icon} alt="" />
            </div>
        </div>
    )
}

export default Library_likesongs
