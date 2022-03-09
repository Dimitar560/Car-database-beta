import { Fragment } from "react";
import { useParams } from "react-router-dom";
import NavBar from "./NavBar";
import useFetch from "../hooks/useFetch";
import "../styles/DetailedInfo.css";

const DetailedInfo = () => {
  const { title } = useParams();
  const { data } = useFetch(`http://localhost:8000/database/${title}`);

  return (
    <Fragment>
      <NavBar />
      <div className="detail-section">
        <h2 className="detailed-title">{data.title}</h2>
        <p className="detailed-text">{data.shortDesc}</p>
        <img className="detailed-image" src={data.src} alt={data.src} />
        <h3 className="detailed-price">
          Prices start from:
          <span className="detailed-green">{" $" + data.priceFrom}</span> to:
          <span className="detailed-green">{" $" + data.priceTo}</span>
        </h3>
        <p className="detailed-engine">
          Petrol engine:{data.petrol === "true" ? "Yes" : "No"}
        </p>
        <p className="detailed-engine">
          Diesel engine:{data.diesel === "true" ? "Yes" : "No"}
        </p>
        <p className="detailed-engine">
          Electric engine:{data.electric === "true" ? "Yes" : "No"}
        </p>

        <p className="detailed-type">
          Sedan:{data.sedan === "true" ? "Yes" : "No"}
        </p>
        <p className="detailed-type">
          Coupe:{data.coupe === "true" ? "Yes" : "No"}
        </p>
        <p className="detailed-type">
          Hatchback:{data.hatchback === "true" ? "Yes" : "No"}
        </p>
        <p className="detailed-type">
          Wagon:{data.wagon === "true" ? "Yes" : "No"}
        </p>
        <p className="detailed-type">
          SUV:{data.suv === "true" ? "Yes" : "No"}
        </p>
        <p className="detailed-type">
          Minivan:{data.minivan === "true" ? "Yes" : "No"}
        </p>
        <p className="detailed-type">
          Pickup:{data.pickup === "true" ? "Yes" : "No"}
        </p>
      </div>
    </Fragment>
  );
};

export default DetailedInfo;
