import React, {useState} from 'react'
import add_btn from '../../assets/img/Home/add_btn.svg'
import check_btn from '../../assets/img/Home/check.svg'

const Searchlist = () => {
    const[isAdd, setIsAdd]=useState(false);

    const AddPlaylist=()=>{
        if(!isAdd){
            setIsAdd(true);
        }else{
            setIsAdd(false);
        }
    }

  return (
    <div id="Searchlist_Wrap">
        <div className="musiclist_container">
            <div className="album_cover"></div>
            <div className="music_info">
                <div className="title">Song</div>
                <div className="artist">Artist</div>
            </div>
        </div>
        <img src={isAdd ? check_btn : add_btn} alt="" onClick={AddPlaylist} />
    </div>
  )
}

export default Searchlist