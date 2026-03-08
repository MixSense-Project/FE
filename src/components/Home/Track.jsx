import React from 'react';

// 1. props에 onClick을 추가합니다.
const Track = ({ img, onClick }) => {
  return (
    // 2. id="Track_Wrap"인 div에 onClick 이벤트를 걸어줍니다.
    <div id="Track_Wrap" onClick={onClick} style={{ cursor: 'pointer' }}>
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