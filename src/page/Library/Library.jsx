import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import plus_btn from "../../assets/img/library/plus_btn.svg";
import camera_icon from "../../assets/img/library/camera_icon.svg";
import Library_myplaylist from "../../components/Library/Library_myplaylist";
import Library_deletesongs from "../../components/Library/Library_deletesongs";
import Musicplay from "../../components/Home/Musicplay";

const Library = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const fileRef = useRef(null);

  const openModal = () => {
    setIsModalOpen(true);
    setPlaylistName("");
    setImagePreview("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onPickImage = () => {
    fileRef.current?.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const onSave = () => {
    // 여기서 API 연결/상태 저장
    // 예) createPlaylist({ name: playlistName, imageFile: fileRef.current.files[0] })
    if (!playlistName.trim()) {
      alert("플레이리스트 이름을 입력해줘.");
      return;
    }

    closeModal();
  };

  return (
    <div className="library_wrap">
      <div className="container">
        <Header title={"Library"} />

        <div className="category">
          <div className="lb_left_btns">
            <button className="playlist" type="button">
              <p>Playlist</p>
            </button>

            <button className="liked" type="button" onClick={() => navigate("/library/liked")}>
              <p>Liked Songs</p>
            </button>
          </div>
          <div className="lb_right_btn">
            <button className="plus_btn" type="button" onClick={openModal} aria-label="플레이리스트 추가">
              <img src={plus_btn} alt="" />
            </button>
          </div>
        </div>
        <Library_myplaylist />
        <Library_myplaylist />
        <Musicplay />

      </div>

      <Nav />

      {isModalOpen && (
        <div className="pl_modal_overlay" onClick={closeModal} role="presentation">
          <div
            className="pl_modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="플레이리스트 추가"
          >
            <div className="pl_modal_top">
              <button type="button" className="pl_modal_btn cancel" onClick={closeModal}>
                취소
              </button>
              <button type="button" className="pl_modal_btn save" onClick={onSave}>
                저장
              </button>
            </div>

            <div className="pl_modal_body">
              <div className="pl_cover" onClick={onPickImage} role="button" tabIndex={0}>
                {imagePreview ? (
                  <img className="pl_cover_preview" src={imagePreview} alt="선택한 이미지 미리보기" />
                ) : (
                  <div className="pl_cover_inner">
                    <img className="pl_camera_icon" src={camera_icon} alt="" />
                  </div>
                )}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="pl_file_input"
              />

              <div className="pl_name">
                <input
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="Myplaylist"
                  className="pl_name_input"
                />
                <div className="pl_name_underline" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
