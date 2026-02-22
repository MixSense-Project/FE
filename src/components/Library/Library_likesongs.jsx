import React, { useState } from 'react'
import heart_icon from '../../assets/img/library/heart.svg'
import emptyheart_icon from '../../assets/img/library/emptyheart_icon.svg'

const Library_likesongs = () => {
    const [liked, setLiked] = useState(true); 

    const toggleHeart = () => {
        setLiked(prev => !prev);
    };

    return (
        <div className='deletesongs_wrap'>
            <div className="c_pl_left">
                <div className="c_pl_cover"></div>
                <div className="song_detail">
                    <p className="c_song_name">Song</p>
                    <p className="c_artist_name">Artist</p>
                </div>
            </div>

            <div className="heart" onClick={toggleHeart}>
                <img
                    src={liked ? heart_icon : emptyheart_icon}
                    alt="like"
                />
            </div>
        </div>
    )
}

export default Library_likesongs

