import { NavLink } from "react-router-dom";
import dj_g from "../assets/img/nav/dj_g.svg";
import home_g from "../assets/img/nav/home_g.svg";
import library_g from "../assets/img/nav/library_g.svg";
import search_g from "../assets/img/nav/search_g.svg";

import home_w from '../assets/img/Nav/home_w.svg'
import search_w from '../assets/img/Nav/aisearch_w.svg'
import library_w from '../assets/img/Nav/library_w.svg'
import dj_w from '../assets/img/Nav/aidj_w.svg'



const Nav = () => {
  const isHomeActive = location.pathname === "/home" || location.pathname === "/home_search" || location.pathname === "/home_trending_now";
  const isSearchActive = location.pathname === "/ai_search" || location.pathname === "/ai_search_onboarding";
  const isAiDjActive = location.pathname === '/ai_dj' || location.pathname === "/ai_dj_onboarding" || location.pathname === "/ai_dj_trackselect" || location.pathname === '/ai_dj_loading' || location.pathname === '/ai_dj_result';

  return (
    <div id="Nav_Wrap">
      <NavLink
        to="/home"
        className={({ isActive }) => `nav_item ${isHomeActive ? "active" : ""}`}
      >
        {({ isActive }) => (
          <>
            <img src={isHomeActive ? home_w : home_g} className="nav_icon" alt="" />
            <p className="nav_p">Home</p>
          </>
        )}
      </NavLink>

      <NavLink
        to="/ai_search"
        className={({ isActive }) => `nav_item ${isSearchActive ? "active" : ""}`}
      >
        {({ isActive }) => (
          <>
            <img src={isSearchActive ? search_w : search_g} className="nav_icon" alt="" />
            <p className="nav_p">AI Search</p>
          </>
        )}
      </NavLink>

      <NavLink
        to="/ai_dj"
        className={({ isActive }) => `nav_item ${isAiDjActive ? "active" : ""}`}
      >
        {({ isActive }) => (
          <>
            <img src={isAiDjActive ? dj_w : dj_g} className="nav_icon" alt="" />
            <p className="nav_p">AI DJ</p>
          </>
        )}
      </NavLink>

      <NavLink
        to="/library"
        className={({ isActive }) => `nav_item ${isActive ? "active" : ""}`}
      >
        {({ isActive }) => (
          <>
            <img
              src={isActive ? library_w : library_g}
              className="nav_icon"
              alt=""
            />
            <p className="nav_p">Library</p>
          </>
        )}
      </NavLink>
    </div>
  );
};

export default Nav;
