
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import edit_btn from "../../assets/img/library/edit_btn.svg";
import pencil_icon from "../../assets/img/library/pencil_icon.svg";
import trash_icon from "../../assets/img/library/trash_icon.svg";

const Library_myplaylist = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  // 메뉴 외부 클릭 시 닫기
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

  const onEdit = () => {
    closeMenu();
    navigate("/library/playlist");
  };

  const onDelete = () => {
    closeMenu();
    // 삭제 로직 연결 예정
    console.log("playlist delete");
  };

  return (
    <div className="myplaylist_wrap">
      <div className="c_pl_left">
        <div className="c_pl_cover" />
        <p className="c_pl_name">Myplaylist</p>
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
              onClick={onEdit}
              role="menuitem"
            >
              <span>playlist edit</span>
              <img src={pencil_icon} alt="" />
            </button>

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
  );
};

export default Library_myplaylist;
