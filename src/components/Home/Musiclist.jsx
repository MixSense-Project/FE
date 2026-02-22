import React, { useState} from 'react'
import add_btn from '../../assets/img/AIDJ/gray_add_btn.svg'
import check_btn from '../../assets/img/Home/check.svg'

const Musiclist = () => {
  
  const [isAdd, setIsdAdd]=useState(false);

  const Addplaylist = () => {
    if (!isAdd){
      setIsdAdd(true);
    }else{
      setIsdAdd(false);
    }
  }

  return (
    <div id="Musiclist_Wrap">
        <div className="musiclist_container">
            <div className="album_cover"></div>
            <div className="music_info">
                <div className="title">Song</div>
                <div className="artist">Artist</div>
            </div>
        </div>
        <img src={isAdd ? check_btn : add_btn} alt="" onClick={Addplaylist}/>
    </div>
  )
}

export default Musiclist