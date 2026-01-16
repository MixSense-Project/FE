import React from "react";
import { useNavigate } from "react-router-dom";
import back_btn from "../assets/img/Header/back_btn.svg";

const SubHeader = ({ title }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div id="SubHeader_Wrap">
      <div className="subheader_content">
        <button className="back_btn" onClick={handleBack}>
          <img src={back_btn} alt="" />
        </button>
        <h1>{title}</h1>
      </div>
    </div>
  );
};

export default SubHeader;
