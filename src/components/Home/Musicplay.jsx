import React, {useState} from 'react'
import music_play from '../../assets/img/Home/music_play.svg'
import music_fast from '../../assets/img/Home/music_fast.svg'
import music_stop from '../../assets/img/Home/music_stop.svg'

const Musicplay = () => {
    const[isPlay, setIsPlay]=useState(false);

    const Playmusic = () =>{
        if(!isPlay){
            setIsPlay(true);
        }else{
            setIsPlay(false);
        }
    }

  return (
    <div id="Musicplay_Wrap">
        <div className="musiclist_container">
            <div className="album_cover"></div>
            <div className="music_info">
                <div className="title">Song</div>
                <div className="artist">Artist</div>
            </div>
        </div>
        <div className="btn_container">
            <button className="play_btn">
                <img src={isPlay ? music_stop : music_play} alt="" onClick={Playmusic}/>
            </button>
            <button className="fast_btn">
                <img src={music_fast} alt="" />
            </button>
        </div>
    </div>
  )
}

export default Musicplay