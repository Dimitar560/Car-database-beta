import { Fragment, useState, useRef } from "react";
import "../styles/UserForm.css";
import NavBar from "./NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/store";

const UserForm = () => {
  const dispatch = useDispatch();

  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const authSwitchHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitFormHandler = (e) => {
    e.preventDefault();

    const enteredUsername = usernameInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    let url;

    setLoading(true);
    if (isLogin) {
      url = "http://localhost:8000/login";
    } else {
      url = "http://localhost:8000/register";
    }
    axios
      .post(
        url,
        JSON.stringify({
          username: enteredUsername,
          password: enteredPassword,
        }),
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        }
      )
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          dispatch(authActions.login());
          console.log(res);
          navigate("/");
        } else {
          dispatch(authActions.logout());
          alert("Wrong password or username");
        }
      })
      .catch((err) => {
        if (err.status === 404) {
          console.error(err);
        }
      });

    usernameInputRef.current.value = "";
    passwordInputRef.current.value = "";
  };

  return (
    <Fragment>
      <NavBar />

      <form className="userForm" onSubmit={submitFormHandler}>
        <h3>{isLogin ? "Login form" : "Register form"}</h3>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" ref={usernameInputRef} required />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordInputRef} required />
        {!loading && (
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        )}
        {loading && <p>Loading...</p>}
        <button type="button" onClick={authSwitchHandler}>
          {isLogin ? "Create new account" : "Login with existing account"}
        </button>
      </form>
    </Fragment>
  );
};

export default UserForm;
