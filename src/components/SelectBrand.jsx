import "../styles/SelectBrand.css";
import mazdaImg from "../images/Mazda-Car-Transparent-Background.png";
import mercedesImg from "../images/Mercedes-Benz-PNG-Photo.png";
import subaruImg from "../images/Blue-Subaru-PNG-Free-Download.png";
import opelImg from "../images/Opel-PNG-Pic.png";
import audiImg from "../images/Audi-A7-S-Line-PNG.png";
import vwImg from "../images/VW-Beetle-PNG-Transparent.png";
import { useState } from "react";

const SelectBrand = () => {
  let cars;
  const [select, setSelect] = useState(cars);
  cars = select;

  const setVisibleHandle = (e) => {
    e.preventDefault();
    setSelect(() => {
      // console.log(e.target.value);
      // setSelect((prev) => {
      if (e.target.value === "mazda") {
        return (cars = (
          <img className="img-selected" src={mazdaImg} alt="mazda" />
        ));
      } else if (e.target.value === "mercedes") {
        return (cars = (
          <img className="img-selected" src={mercedesImg} alt="mercedes" />
        ));
      } else if (e.target.value === "subaru") {
        return (cars = (
          <img className="img-selected" src={subaruImg} alt="subaru" />
        ));
      } else if (e.target.value === "opel") {
        return (cars = (
          <img className="img-selected" src={opelImg} alt="opel" />
        ));
      } else if (e.target.value === "audi") {
        return (cars = (
          <img className="img-selected" src={audiImg} alt="audi" />
        ));
      } else if (e.target.value === "vw") {
        return (cars = <img className="img-selected" src={vwImg} alt="vw" />);
      }
    });
    // });
  };

  return (
    <section id="select-brand">
      <label className="title-select">
        Select from diffrent types of vehicles
      </label>
      <br />
      <select className="select-car" onChange={setVisibleHandle}>
        <option>None</option>
        <option value="mazda">Mazda</option>
        <option value="mercedes">Mercedes</option>
        <option value="subaru">Subaru</option>
        <option value="opel">Opel</option>
        <option value="audi">Audi</option>
        <option value="vw">VW</option>
      </select>

      <div className="img-select">{cars}</div>
    </section>
  );
};

export default SelectBrand;
