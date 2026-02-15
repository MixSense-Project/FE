import React from "react";

const Preference_selectbtn = ({ text = "Select", disabled, onClick }) => {
  return (
    <div className="selectionbtn_wrap">
      <button
        type="button"
        className="selectionbtn"
        disabled={disabled}
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

export default Preference_selectbtn;
