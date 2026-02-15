import React from "react";

const Preference_artist_circle = ({ artist, isSelected, onClick }) => {
  if (!artist) return null;

  return (
    <button
      type="button"
      className={`artistcircle_wrap ${isSelected ? "is-selected" : ""}`}
      onClick={onClick}
    >
      <img
        className="artistcircle_img"
        src={artist.imageUrl}
        alt={artist.name}
        loading="lazy"
      />
      <span className="artistcircle_overlay" />
      <span className="artistcircle_label">{artist.name}</span>
    </button>
  );
};

export default Preference_artist_circle;
