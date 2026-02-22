import React, { useRef, useState } from "react";
import SubHeader from '../../components/SubHeader'
import Nav from '../../components/Nav'
import edit_btn from '../../assets/img/Home/edit_btn.svg'

const Mypage = () => {

  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);

  const onPickImage = () => {
    fileRef.current?.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };


  return (
    
    <div className='mypage_wrap'>
        <div className="container">
          <SubHeader title={"MyPage"}/>
          <div className="profile" onClick={onPickImage} role="button" tabIndex={0}>
            {imagePreview ? (
              <img className="profile_img" src={imagePreview} alt="선택한 이미지 미리보기" />
            ) : (
              <div className="profile_img">
                <img className="profile_img_edit" src={edit_btn} alt="" />
              </div>
            )}
              <input 
            type="file" 
            style={{ display: "none" }} 
            ref={fileRef} 
            onChange={onFileChange} 
            accept="image/*" 
          /> 
          </div>
          <div className="name">
            <input type="text" />
          </div>
          <div className="btn">
            <button className="logout">Logout</button>
            <button className="logout">Unsubscribe</button>
          </div>
          <div className="area"></div>
        </div>
        <div className="area"></div>
    </div>
  )
}

export default Mypage