import { Fragment } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  const goBackHandler = () => navigate(-1);

  return (
    <Fragment>
      <NavBar />
      <h1>404 Page Not Found</h1>
      <button onClick={goBackHandler}>Please go back</button>
    </Fragment>
  );
};

export default ErrorPage;
