import React from 'react'

const Track = ({ img }) => {
  return (
    <div id="Track_Wrap">
      {img ? (
        <img src={img} alt="album" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div className="placeholder" style={{ backgroundColor: '#333', width: '100%', height: '100%' }} />
      )}
    </div>
  );
};

export default Track

