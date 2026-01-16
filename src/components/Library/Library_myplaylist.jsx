import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import edit_btn from "../../assets/img/library/edit_btn.svg";
import pencil_icon from "../../assets/img/library/pencil_icon.svg";
import trash_icon from "../../assets/img/library/trash_icon.svg";
import camera_icon from "../../assets/img/library/camera_icon.svg";

const Library_myplaylist = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuRef = useRef(null);
  const fileRef = useRef(null);

  const [playlistName, setPlaylistName] = useState("Myplaylist");
  const [imagePreview, setImagePreview] = useState(null);

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  const openModal = () => {
    closeMenu();
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const onSave = () => {
    console.log("save playlist:", playlistName);
    closeModal();
  };

  const onDelete = () => {
    closeMenu();
    console.log("playlist delete");
  };

  const onPickImage = () => {
    fileRef.current?.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      <div className="myplaylist_wrap">
        <div className="c_pl_left">
          <div className="c_pl_cover" />
          <p
            className="c_pl_name"
            onClick={() => navigate("/library/playlist")}
            role="button"
            tabIndex={0}
          >
            Myplaylist
          </p>
        </div>

        <div className="edit_area" ref={menuRef}>
          <button
            type="button"
            className="edit_btn"
            onClick={toggleMenu}
            aria-label="플레이리스트 메뉴"
          >
            <img src={edit_btn} alt="" />
          </button>

          {open && (
            <div className="pl_menu" role="menu">
              <button
                type="button"
                className="pl_menu_item"
                onClick={openModal}
                role="menuitem"
              >
                <span>playlist edit</span>
                <img src={pencil_icon} alt="" />
              </button>

              <div className="pl_line" />

              <button
                type="button"
                className="pl_menu_item"
                onClick={onDelete}
                role="menuitem"
              >
                <span>playlist delete</span>
                <img src={trash_icon} alt="" />
              </button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="pl_modal_overlay" onClick={closeModal} role="presentation">
          <div
            className="pl_modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="플레이리스트 수정"
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
                  <img
                    className="pl_cover_preview"
                    src={imagePreview}
                    alt="선택한 이미지 미리보기"
                  />
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
    </>
  );
};

export default Library_myplaylist;
