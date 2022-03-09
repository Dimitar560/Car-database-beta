import axios from "axios";
import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/NavBar.css";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/store";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.isAuthenticated);
  const logoutHandler = () => {
    axios.post("http://localhost:8000/logout").then((res) => res.data);
    dispatch(authActions.logout());
    navigate("/");
  };

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
      {!isAuth && (
        <NavLink to="/userform" className="link">
          Login
        </NavLink>
      )}
      {isAuth && (
        <NavLink to="/postauto" className="link">
          Postauto
        </NavLink>
      )}
      {isAuth && (
        <button type="submit" onClick={logoutHandler}>
          Logout
        </button>
      )}
    </nav>
  );
};

export default NavBar;
