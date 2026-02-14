import React from "react";

const Preference_genre_circle = ({ label, image, selected, onClick }) => {
  return (
    <button
      type="button"
      className={`genrecircle_wrap ${selected ? "is-selected" : ""}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <img className="genrecircle_img" src={image} alt={label} />
      <span className="genrecircle_overlay" />
      <span className="genrecircle_label">{label}</span>
    </button>
  );
};

export default Preference_genre_circle;
