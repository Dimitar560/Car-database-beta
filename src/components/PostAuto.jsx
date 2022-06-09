import axios from "axios";
import { Fragment, useRef } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "../styles/PostAuto.css";

const PostAuto = () => {
  const srcRef = useRef();
  const titleRef = useRef();
  const shortDescRef = useRef();
  const priceFromRef = useRef();
  const priceToRef = useRef();
  const petrolRef = useRef();
  const dieselRef = useRef();
  const electricRef = useRef();
  const sedanRef = useRef();
  const coupeRef = useRef();
  const wagonRef = useRef();
  const hatchbackRef = useRef();
  const suvRef = useRef();
  const minivanRef = useRef();
  const pickupRef = useRef();

  const addCarHandler = (car) => {
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
      priceFrom: priceFromRef.current.value,
      priceTo: priceToRef.current.value,
      petrol: petrolRef.current.checked,
      diesel: dieselRef.current.checked,
      electric: electricRef.current.checked,
      sedan: sedanRef.current.checked,
      coupe: coupeRef.current.checked,
      wagon: wagonRef.current.checked,
      hatchback: hatchbackRef.current.checked,
      suv: suvRef.current.checked,
      minivan: minivanRef.current.checked,
      pickup: pickupRef.current.checked,
    };
    addCarHandler(cars);

    srcRef.current.value = "";
    titleRef.current.value = "";
    shortDescRef.current.value = "";
    priceFromRef.current.value = "";
    priceToRef.current.value = "";
    petrolRef.current.checked = false;
    dieselRef.current.checked = false;
    electricRef.current.checked = false;
    sedanRef.current.checked = false;
    coupeRef.current.checked = false;
    wagonRef.current.checked = false;
    hatchbackRef.current.checked = false;
    suvRef.current.checked = false;
    minivanRef.current.checked = false;
    pickupRef.current.checked = false;
  };

  return (
    <Fragment>
      <NavBar />
      <h2 className="title-label">Post form</h2>
      <form className="postauto-form" onSubmit={formSubmit}>
        <label htmlFor="title">Auto Name</label>
        <br />
        <input
          className="input-text"
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
          className="input-text"
          type="text"
          id="src"
          ref={srcRef}
          placeholder="Type..."
          required
        />
        <br />
        <label htmlFor="priceFrom">Price range from</label>
        <input
          className="form-from-to"
          type="text"
          id="priceFrom"
          placeholder="Type..."
          ref={priceFromRef}
          required
        />
        <label htmlFor="priceTo">To</label>
        <input
          className="form-from-to"
          type="text"
          id="priceTo"
          placeholder="Type..."
          ref={priceToRef}
          required
        />
        <br />
        <label>Types of engines:</label>
        <label className="form-checkbox-label">
          <input
            className="form-checkbox"
            type="checkbox"
            id="petrol"
            ref={petrolRef}
            value="Petrol"
          />
          Petrol
        </label>
        <label className="form-checkbox-label">
          <input
            className="form-checkbox"
            type="checkbox"
            id="diesel"
            ref={dieselRef}
            value="Diesel"
          />
          Diesel
        </label>
        <label className="form-checkbox-label">
          <input
            className="form-checkbox"
            type="checkbox"
            id="electric"
            ref={electricRef}
            value="Electric"
          />
          Electric
        </label>
        <br />
        <label>Types of vehicles:</label>

        <label className="form-checkbox-label">
          <input
            className="form-checkbox"
            type="checkbox"
            id="sedan"
            ref={sedanRef}
            value="Sedan"
          />
          Sedan
        </label>
        <label className="form-checkbox-label">
          <input
            className="form-checkbox"
            type="checkbox"
            id="coupe"
            ref={coupeRef}
            value="Coupe"
          />
          Coupe
        </label>
        <label className="form-checkbox-label">
          <input
            className="form-checkbox"
            type="checkbox"
            id="wagon"
            ref={wagonRef}
            value="Wagon"
          />
          Wagon
        </label>
        <label className="form-checkbox-label">
          <input
            className="form-checkbox"
            type="checkbox"
            id="hatchback"
            ref={hatchbackRef}
            value="Hatchback"
          />
          Hatchback
        </label>
        <label className="form-checkbox-label">
          <input
            className="form-checkbox"
            type="checkbox"
            id="suv"
            ref={suvRef}
            value="SUV"
          />
          SUV
        </label>
        <label className="form-checkbox-label">
          <input
            className="form-checkbox"
            type="checkbox"
            id="minivan"
            ref={minivanRef}
            value="Minivan"
          />
          Minivan
        </label>
        <label className="form-checkbox-label">
          <input
            className="form-checkbox"
            type="checkbox"
            id="pickup"
            ref={pickupRef}
            value="Pickup"
          />
          Pickup truck
        </label>
        <br />
        <button type="submit">Add</button>
      </form>
      <Footer />
    </Fragment>
  );
};

export default PostAuto;
