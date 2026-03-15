import React from 'react';

const Track = ({ img, title, onClick }) => {
  return (
    <div 
      id="Track_Wrap" 
      onClick={onClick} 
      style={{ 
        width: '114px',      // 고정 사이즈 활성화
        height: '114px',     // 고정 사이즈 활성화
        overflow: 'hidden', 
        cursor: 'pointer',
        backgroundColor: '#222',
        position: 'relative',
      }}
    >
      {img ? (
        <img 
          src={img} 
          alt={title || "track thumbnail"} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            transform: 'scale(1.4)', // 이미지 확대 유지
            display: 'block'
          }} 
          onError={(e) => {
            e.target.style.backgroundColor = '#333';
            e.target.style.transform = 'none'; 
          }} 
        />
      ) : (
        <div className="placeholder" style={{ width: '100%', height: '100%', backgroundColor: '#222' }} />
      )}

      {/* 제목 추가: 하단에 그라데이션과 함께 표시 */}
      {title && (
        <div style={{
          position: 'absolute',
          bottom: 2,
          left: 2,
          // background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
          color: '#fff',
          fontSize: '12px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          zIndex: 1
        }}>
          {title}
        </div>
      )}
    </div>
  );
};

export default Track;