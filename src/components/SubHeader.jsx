import React from "react";
import { useNavigate } from "react-router-dom";
import back_btn from "../assets/img/Header/back_btn.svg";

const SubHeader = ({
  title,
  bgColor = "var(--gray02)",
  rightIcon,       
  onRightClick,     
  rightAlt = "",
}) => {
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  return (
    <div id="SubHeader_Wrap" style={{ backgroundColor: bgColor }}>
      <div className="subheader_content">
        <button className="back_btn" onClick={handleBack}>
          <img src={back_btn} alt="" />
        </button>

        <h1>{title}</h1>

        {rightIcon ? (
          <button className="right_btn" onClick={onRightClick}>
            <img src={rightIcon} alt={rightAlt} />
          </button>
        ) : (
          <div className="right_btn_placeholder" />
        )}
      </div>
    </div>
  );
};

export default SubHeader;
