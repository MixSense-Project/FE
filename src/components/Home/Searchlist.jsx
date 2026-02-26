import React, { useState } from 'react'
import add_btn from '../../assets/img/AIDJ/gray_add_btn.svg'
import check_btn from '../../assets/img/home/check.svg'

const Searchlist = ({ data, onClick }) => {
  const [isAdd, setIsAdd] = useState(false);

  return (
    <div 
      id="Searchlist_Wrap" 
      onMouseDown={(e) => onClick(e, data)} 
      style={{ cursor: 'pointer', userSelect: 'none' }}
    >
      <div className="musiclist_container" style={{ pointerEvents: 'none' }}>
        <div className="album_cover">
          <img 
            src={data?.track_image_url || data?.thumbnail_url} 
            alt="cover" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 3 }} 
          />
        </div>
        <div className="music_info">
          <div className="title">{data?.title || "Unknown Song"}</div>
          <div className="artist">{data?.artist || "Unknown Artist"}</div>
        </div>
      </div>
      <button className="add_btn" onMouseDown={(e) => {
        // 버튼 클릭 시에는 부모의 저장 로직이 실행되지 않도록 차단
        e.stopPropagation(); 
        setIsAdd(!isAdd);
      }}>
        <img src={isAdd ? check_btn : add_btn} alt="" />
      </button>
    </div>
  )
}

export default Searchlist