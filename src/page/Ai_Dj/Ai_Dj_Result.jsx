import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import graphic from "../../assets/img/AISearch/graphic.png";
import pencil_icon from "../../assets/img/library/pencil_icon.svg";
import trash_icon from "../../assets/img/library/trash_icon.svg";
import plus_btn from '../../assets/img/library/plus_btn.svg'
const Ai_Dj_Result = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => setOpen((prev) => !prev);

    const openModal = () => { };
    const onDelete = () => { };

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        window.addEventListener("mousedown", handleClickOutside);
        return () => window.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <div className="aidjresult_wrap">
            <div className="container">
                <Header />

                <div className="result_header">
                    <h1>AI mix creation complete!</h1>
                    <p>Enjoy your unique mixing sense.</p>
                </div>

                <div className="result_song">
                    <div className="rs_cover"></div>
                    <div className="rs_right">
                        <p className="p1">Music X Music Remix</p>
                        <p className="p2">3m 32s</p>
                    </div>
                </div>

                <img src={graphic} alt="" className="graphic" />

                <div className="edit_area" ref={menuRef}>
                    <button type="button" className="addpl_btn" onClick={toggleMenu}>
                        Add to playlist
                        {open && (
                            <div className="pl_menu" role="menu">
                                <button
                                    type="button"
                                    className="pl_menu_item"
                                    onClick={openModal}
                                    role="menuitem"
                                >
                                    <span>Add to 'myplaylist'</span>
                                    <img src={plus_btn} alt="" />
                                </button>

                                <div className="pl_line" />
                                <button
                                    type="button"
                                    className="pl_menu_item"
                                    onClick={openModal}
                                    role="menuitem"
                                >
                                    <span>Add to 'myplaylist'</span>
                                    <img src={plus_btn} alt="" />
                                </button>

                                <div className="pl_line" />
                                <button
                                    type="button"
                                    className="pl_menu_item"
                                    onClick={openModal}
                                    role="menuitem"
                                >
                                    <span>Add to 'myplaylist'</span>
                                    <img src={plus_btn} alt="" />
                                </button>

                                <div className="pl_line" />
                                <button
                                    type="button"
                                    className="pl_menu_item"
                                    onClick={openModal}
                                    role="menuitem"
                                >
                                    <span>Add to 'myplaylist'</span>
                                    <img src={plus_btn} alt="" />
                                </button>

                                <div className="pl_line" />
                                <button
                                    type="button"
                                    className="pl_menu_item"
                                    onClick={openModal}
                                    role="menuitem"
                                >
                                    <span>Add to 'myplaylist'</span>
                                    <img src={plus_btn} alt="" />
                                </button>

                                <div className="pl_line" />
                                <button
                                    type="button"
                                    className="pl_menu_item"
                                    onClick={openModal}
                                    role="menuitem"
                                >
                                    <span>Add to 'myplaylist'</span>
                                    <img src={plus_btn} alt="" />
                                </button>

                                <div className="pl_line" />

                                <button
                                    type="button"
                                    className="pl_menu_item"
                                    onClick={onDelete}
                                    role="menuitem"
                                >
                                    <span>Add to 'myplaylist'</span>
                                    <img src={plus_btn} alt="" />
                                </button>
                            </div>
                        )}
                    </button>
                </div>

                <button className="backdj_btn" type="button">
                    Back to AI DJ
                </button>
            </div>

            <Nav />
        </div>
    );
};

export default Ai_Dj_Result;
