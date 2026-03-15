import React from 'react';

const Track = ({ img, onClick }) => {
  return (
    <div 
      id="Track_Wrap" 
      onClick={onClick} 
      style={{ 
        // width: '114px', 
        // height: '114px', 
        overflow: 'hidden', 
        cursor: 'pointer',
        backgroundColor: '#222',
        position: 'relative'
      }}
    >
      {img ? (
        <img 
          src={img} 
          alt="track thumbnail" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            transform: 'scale(1.4)', 
            
            display: 'block'
          }} 
          onError={(e) => {
            console.log("이미지 로드 실패:", e.target.src);
            e.target.style.backgroundColor = '#333';
            e.target.style.transform = 'none'; 
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
          {/* 이미지가 없을 때 보여줄 아이콘 등을 넣을 수 있습니다 */}
        </div>
      )}
    </div>
  );
};

export default Track;