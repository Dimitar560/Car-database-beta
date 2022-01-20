import { Fragment } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";

import About from "./components/About";
import PostAuto from "./components/PostAuto";
import DetailedInfo from "./components/DetailedInfo";
import DataBase from "./components/DataBase";
import { Routes, Route } from "react-router-dom";
// import DataBasePage from "./pages/DataBasePage";

function App() {
  return (
    <Fragment>
      <Routes>
        <Route index element={<Home />} />
        <Route path="about" element={<About />}></Route>
        <Route path="database" element={<DataBase />} />
        <Route path="database/:title" element={<DetailedInfo />} />
        <Route path="postauto" element={<PostAuto />} />
      </Routes>
    </Fragment>
  );
}

export default App;
