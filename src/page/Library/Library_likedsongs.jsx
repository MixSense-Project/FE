import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Nav from '../../components/Nav'
import Library_likesongs from '../../components/Library/Library_likesongs'
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
                <Library_likesongs />
                <Library_likesongs />
                <Library_likesongs />
                <Library_likesongs />
                <Library_likesongs />
                <Library_likesongs />
                <Library_likesongs />
            </div>
            <Nav />
        </div>
    )
}

export default Library_likedsongs
