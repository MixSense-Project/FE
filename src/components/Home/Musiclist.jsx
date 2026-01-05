import React from 'react'
import add_btn from '../../assets/img/Home/add_btn.svg'

const Musiclist = () => {
  return (
    <div id="Musiclist_Wrap">
        <div className="musiclist_container">
            <div className="album_cover"></div>
            <div className="music_info">
                <div className="title">Song</div>
                <div className="artist">Artist</div>
            </div>
        </div>
        <img src={add_btn} alt="" />
    </div>
  )
}

export default Musiclist