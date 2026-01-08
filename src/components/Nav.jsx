import { NavLink } from "react-router-dom";
import dj_g from "../assets/img/nav/dj_g.svg";
import dj_p from "../assets/img/nav/dj_p.svg";
import home_g from "../assets/img/nav/home_g.svg";
import home_p from "../assets/img/nav/home_p.svg";
import library_g from "../assets/img/nav/library_g.svg";
import library_p from "../assets/img/nav/library_p.svg";
import search_g from "../assets/img/nav/search_g.svg";
import search_p from "../assets/img/nav/search_p.svg";

const Nav = () => {
  const isHomeActive = location.pathname === "/home" || location.pathname === "/home_search" || location.pathname === "/home_trending_now";

  return (
    <div id="Nav_Wrap">
      <NavLink
        to="/home"
        className={({ isHomeActive }) => `nav_item ${isHomeActive ? "active" : ""}`}
      >
        {({ isActive }) => (
          <>
            <img src={isHomeActive ? home_p : home_g} className="nav_icon" alt="" />
            <p className="nav_p">Home</p>
          </>
        )}
      </NavLink>

      <NavLink
        to="/ai_search_onboarding"
        className={({ isActive }) => `nav_item ${isActive ? "active" : ""}`}
      >
        {({ isActive }) => (
          <>
            <img src={isActive ? search_p : search_g} className="nav_icon" alt="" />
            <p className="nav_p">AI Search</p>
          </>
        )}
      </NavLink>

      <NavLink
        to="/ai_dj"
        className={({ isActive }) => `nav_item ${isActive ? "active" : ""}`}
      >
        {({ isActive }) => (
          <>
            <img src={isActive ? dj_p : dj_g} className="nav_icon" alt="" />
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
              src={isActive ? library_p : library_g}
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
