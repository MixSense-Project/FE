// import React from 'react'
// import del_btn from '../../assets/img/library/cancel_g.svg'

// const Searchedlist = ({ data, onDelete }) => {
//   if (!data) return null;
  
//   console.log("히스토리 아이템 데이터:", data);

//   return (
//     <div id="Searchedlist_Wrap">
//       <div className="musiclist_container">
//         <div className="album_cover">
//            <img 
//             src={data?.track_image_url || data?.thumbnail_url} 
//             alt="cover" 
//             style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 3 }} 
//           />
//         </div>
//         <div className="music_info">
//           <div className="title">{data.keyword || data.title || "Unknown"}</div>
//           <div className="artist">{data.artist || "artists"}</div>
//         </div>
//       </div>
//       <div className="icon_container">
//         <button 
//           className="del_btn" 
//           onClick={(e) => {
//             e.stopPropagation(); 
//             if (data.search_history_id) {
//               onDelete(data.search_history_id);
//             } else {
//               console.warn("삭제할 ID가 없습니다.", data);
//             }
//           }}
//         >
//           <img src={del_btn} alt="delete" />
//         </button>
//       </div>
//     </div>
//   )
// }

// export default Searchedlist;

import React from 'react';
import del_btn from '../../assets/img/library/cancel_g.svg';

const Searchedlist = ({ data, onDelete, onClick }) => {
  if (!data) return null;

  return (
    <div 
      id="Searchedlist_Wrap" 
      onClick={onClick} // 클릭 시 재생 함수 실행
      style={{ cursor: 'pointer' }}
    >
      <div className="musiclist_container" style={{ pointerEvents: 'none' }}>
        <div className="album_cover">
           <img 
            src={data?.track_image_url || data?.thumbnail_url || `https://img.youtube.com/vi/${data.youtube_video_id}/mqdefault.jpg`} 
            alt="cover" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 3 }} 
          />
        </div>
        <div className="music_info">
          <div className="title">{data.keyword || data.title || "Unknown"}</div>
          <div className="artist">{data.artist || "artists"}</div>
        </div>
      </div>
      <div className="icon_container">
        <button 
          className="del_btn" 
          style={{ background: 'none', border: 'none' }}
          onClick={(e) => {
            e.stopPropagation(); // 재생 이벤트 전파 차단
            if (data.search_history_id) {
              onDelete(data.search_history_id);
            }
          }}
        >
          <img src={del_btn} alt="delete" />
        </button>
      </div>
    </div>
  );
};

export default Searchedlist;