import React, {useState} from 'react'
import add_btn from '../../assets/img/AIDJ/gray_add_btn.svg'
import check_btn from '../../assets/img/home/check.svg'
import del_btn from '../../assets/img/library/cancel_g.svg'

const Searchedlist = () => {
    const[isAdd, setIsAdd]=useState(false)
    
    const AddPlaylist=()=>{
        if(!isAdd){
            setIsAdd(true);
        }else{
            setIsAdd(false);
        }
    }

    const[isVisible, setIsVisible]=useState('true')

    const handleDelete = () => {
        setIsVisible(false)
    }
    
    if(!isVisible){
        return null;
    }    

  return (
    <div id="Searchedlist_Wrap">
        <div className="musiclist_container">
            <div className="album_cover"></div>
            <div className="music_info">
                <div className="title">Song</div>
                <div className="artist">Artist</div>
            </div>
        </div>
       <div className="icon_container">
            <button className="add_btn" onClick={AddPlaylist}>
                <img src={isAdd ? check_btn : add_btn} alt=""  />
            </button>
            <button className="del_btn" onClick={handleDelete} >
                <img src={del_btn} alt="" />
            </button>
       </div>
    </div>
  )
}

export default Searchedlist