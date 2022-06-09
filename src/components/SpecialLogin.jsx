import "../styles/UserForm.css";
import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/store";

const SpecialLogin = () => {
  const dispatch = useDispatch();

  const usernameInputRef = useRef();
  const passwordInputRef = useRef();
  const workplaceInputRef = useRef();

  const [specialLogin, setSpecialLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const registerHandler = () => {
    setSpecialLogin((prevState) => !prevState);
  };

  const submitFormHandler = (e) => {
    e.preventDefault();

    const enteredUsername = usernameInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredWorkplace = workplaceInputRef.current.value;

    let url;

    setLoading(true);
    if (specialLogin) {
      url = "http://localhost:8000/specialLogin";
    } else {
      url = "http://localhost:8000/specialRegister";
    }
    axios
      .post(
        url,
        JSON.stringify({
          username: enteredUsername,
          password: enteredPassword,
          workplace: enteredWorkplace,
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
          alert("Logged in successfully");
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
    workplaceInputRef.current.value = "";
  };

  return (
    <form className="userForm" onSubmit={submitFormHandler}>
      <h3>{specialLogin ? "Login form" : "Register form"}</h3>
      <label>Special User</label>
      <input type="email" id="email" ref={usernameInputRef} required />
      <label>Password</label>
      <input type="password" id="password" ref={passwordInputRef} required />
      {!specialLogin && <label>Workplace</label>}

      <select ref={workplaceInputRef} id="workplace">
        <option value="IS Auto">IS Auto</option>
        <option value="MM Auto">MM Auto</option>
      </select>

      {loading && <p>Loading...</p>}
      {!loading && (
        <button type="submit">{specialLogin ? "Login" : "Register"}</button>
      )}
      <button type="button" onClick={registerHandler}>
        {specialLogin ? "Make new account" : "You have account"}
      </button>
    </form>
  );
};

export default SpecialLogin;
