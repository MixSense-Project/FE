import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import edit_btn from "../../assets/img/library/edit_btn.svg";
import pencil_icon from "../../assets/img/library/pencil_icon.svg";
import trash_icon from "../../assets/img/library/trash_icon.svg";

const Library_myplaylist = ({
  id, 
  title = "Myplaylist",
  coverUrl = null,
  onClick,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

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
    <div className="myplaylist_wrap">
      <div className="c_pl_left">
        <div className="c_pl_cover">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : null}
        </div>

        <p
          className="c_pl_name"
          onClick={() => (onClick ? onClick() : navigate("/library/playlist"))}
          role="button"
          tabIndex={0}
        >
          {title}
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
              onClick={() => {
                closeMenu();
                onEdit?.({ id, title, coverUrl });
              }}
              role="menuitem"
            >
              <span>playlist edit</span>
              <img src={pencil_icon} alt="" />
            </button>

            <div className="pl_line" />

            <button
              type="button"
              className="pl_menu_item"
              onClick={() => {
                closeMenu();
                 onDelete?.(id);
              }}
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