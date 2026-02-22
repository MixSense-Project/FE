import React from 'react'
import { useState } from 'react'
import check_icon from '../../assets/img/home/check.svg'
import nocheck_icon from '../../assets/img/AIDJ/empty_circle.svg'

const Playlist_add = () => {
    const [isAdd, setIsAdd] = useState(false)

    const AddPlaylist = () =>{
        if(!isAdd){
            setIsAdd(true);
        }else{
            setIsAdd(false);
        }
    }
  return (
    <div className="playlist_add_wrap">
        <div className="playlist_left">
            <div className="album_cover"></div>
            <div className="playlist_title">Myplaylist</div>
        </div>
        <div className="playlist_right">
            <img src={isAdd ? check_icon : nocheck_icon} onClick={AddPlaylist} alt="" />
        </div>
    </div>
  )
}

export default Playlist_add