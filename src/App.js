import { Fragment } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";

import About from "./components/About";
import PostAuto from "./components/PostAuto";
import DetailedInfo from "./components/DetailedInfo";
import DataBase from "./components/DataBase";
import { Routes, Route } from "react-router-dom";
import UserForm from "./components/UserForm";
import { useSelector } from "react-redux";
import Edit from "./components/Edit";
import ErrorPage from "./components/ErrorPage";

// import DataBasePage from "./pages/DataBasePage";

function App() {
  const isAuth = useSelector((state) => state.isAuthenticated);
  return (
    <Fragment>
      <Routes>
        <Route index element={<Home />} />
        <Route path="about" element={<About />}></Route>
        <Route path="database" element={<DataBase />} />
        <Route path="database/:title" element={<DetailedInfo />} />
        {isAuth && <Route path="postauto" element={<PostAuto />} />}
        <Route path="userform" element={<UserForm />} />
        {isAuth && <Route path="database/update/:title" element={<Edit />} />}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Fragment>
  );
}

export default App;
