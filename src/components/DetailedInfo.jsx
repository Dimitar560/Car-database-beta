import { Fragment } from "react";
import { useParams } from "react-router-dom";
import NavBar from "./NavBar";
import useFetch from "../hooks/useFetch";
import "../styles/DetailedInfo.css";

const DetailedInfo = () => {
  const { title } = useParams();
  const { data } = useFetch(`http://localhost:8000/database/${title}`);
  console.log(data);
  return (
    <Fragment>
      <NavBar />
      <div className="detail-section">
        <h2 className="detailed-title">{data.title}</h2>
        <p className="detailed-text">{data.shortDesc}</p>
        <img className="detailed-image" src={data.src} alt={data.src} />
      </div>
    </Fragment>
  );
};

export default DetailedInfo;
