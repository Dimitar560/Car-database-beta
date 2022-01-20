import axios from "axios";
import { Fragment, useRef } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "../styles/PostAuto.css";

const PostAuto = () => {
  const srcRef = useRef();
  const titleRef = useRef();
  const shortDescRef = useRef();

  const addMovieHandler = (car) => {
    axios.post("http://localhost:8000/database", JSON.stringify(car), {
      headers: { "Content-Type": "application/json" },
    });
  };

  const formSubmit = (e) => {
    e.preventDefault();

    const cars = {
      src: srcRef.current.value,
      title: titleRef.current.value,
      shortDesc: shortDescRef.current.value,
    };
    addMovieHandler(cars);

    srcRef.current.value = "";
    titleRef.current.value = "";
    shortDescRef.current.value = "";
  };

  return (
    <Fragment>
      <NavBar />
      <form className="postauto-form" onSubmit={formSubmit}>
        <label htmlFor="title">Auto Name</label>
        <br />
        <input
          type="text"
          id="title"
          ref={titleRef}
          placeholder="Type..."
          required
        />
        <br />
        <label htmlFor="shortDesc">Short description</label>
        <br />
        <textarea
          id="shortDesc"
          rows="3"
          cols="70"
          ref={shortDescRef}
          placeholder="Type..."
          required
        />
        <br />
        <label htmlFor="src">Photo src</label>
        <br />
        <input
          type="text"
          id="src"
          ref={srcRef}
          placeholder="Type..."
          required
        />
        <br />
        <button type="submit">Add</button>
      </form>
      <Footer />
    </Fragment>
  );
};

export default PostAuto;
