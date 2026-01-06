import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Nav from '../../components/Nav'
import plus_btn from '../../assets/img/library/plus_btn.svg'

const Library_likedsongs = () => {
    const navigate = useNavigate()
    return (
        <div className='librarylikedsongs_wrap'>
            <div className="container">
                <Header title={"Library"} />

                <div className="category">
                    <button className="playlist"
                        onClick={() => navigate('/library')}>
                        <p>Playlist</p>
                    </button>

                    <button
                        className="liked"
                        onClick={() => navigate('/library/liked')}
                    >
                        <p>Liked Songs</p>
                    </button>
                </div>
            </div>
            <Nav />
        </div>
    )
}

export default Library_likedsongs
