import React from 'react';

const Track = ({ img }) => {
  return (
    <div 
      id="Track_Wrap">
      {img ? (
        <img 
          src={img} 
          alt="album thumbnail" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }} 
          onError={(e) => {
            console.log("이미지 로드 실패:", e.target.src);
            e.target.style.display = 'none'; 
          }} 
        />
      ) : (
        <div 
          className="placeholder" 
          style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            fontSize: '10px',
            color: '#555'
          }}
        >
        </div>
      )}
    </div>
  );
};

export default Track;