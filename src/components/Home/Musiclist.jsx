import React, { useState} from 'react'
import add_btn from '../../assets/img/AIDJ/gray_add_btn.svg'
import check_btn from '../../assets/img/home/check.svg'

const Musiclist = ({data}) => {
  
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
            <div 
            className="album_cover"
            style={{
                backgroundImage: `url('${data.track.track_image_url || data.track.thumbnail || ""}')`,
                backgroundSize: 'cover', 
              }}
            ></div>
            <div className="music_info">
                <div className="title">{data.track.title}</div>
                <div className="artist">{data.track.artist}</div>
            </div>
        </div>
        <img src={isAdd ? check_btn : add_btn} alt="" onClick={Addplaylist}/>
    </div>
  )
}

export default Musiclist