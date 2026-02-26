import React from 'react';

const Track = ({ img }) => {
  return (
    <div id="Track_Wrap">
      {img ? (
        <img 
          src={img} 
          alt="track thumbnail" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            borderRadius: 3.21,
          }} 
          onError={(e) => {
            console.log("이미지 로드 실패:", e.target.src);
            e.target.style.backgroundColor = '#333';
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
            backgroundColor: '#222'
          }}
        >
        </div>
      )}
    </div>
  );
};

export default Track;