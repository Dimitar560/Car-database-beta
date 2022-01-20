import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/NavBar.css";

const NavBar = () => {
  return (
    <nav id="navibar">
      <h1 className="brand">Car Database</h1>
      <NavLink to="/" className="link">
        Home
      </NavLink>
      <NavLink to="/about" className="link">
        About
      </NavLink>
      <NavLink to="/database" className="link">
        Database
      </NavLink>

      <NavLink to="/postauto" className="link">
        Postauto
      </NavLink>
    </nav>
  );
};

export default NavBar;
