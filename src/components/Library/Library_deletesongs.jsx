import React from 'react'
import delete_btn from '../../assets/img/library/cancel_g.svg'


const Library_deletesongs = () => {
    return (
        <div className='deletesongs_wrap'>
            <div className="c_pl_left">
                <div className="c_pl_cover"></div>
                <div className="song_detail">
                    <p className="c_song_name">Song</p>
                    <p className="c_artist_name"> Artist</p>
                </div>
            </div>
            <div className="delete">
                <img src={delete_btn} alt="" />
            </div>
        </div>
    )
}

export default Library_deletesongs
