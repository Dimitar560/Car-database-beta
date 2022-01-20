import { Fragment } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import axios from "axios";
import "../styles/DataBase.css";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
// import DetailedInfo from "./DetailedInfo";

const DataBase = () => {
  const navigate = useNavigate();
  // useEffect(() => {
  //   fetchAuto();
  // }, []);

  // const [data, setData] = useState([]);

  // // const [loading, setLoading] = useState(false);

  // const fetchAuto = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:8000/database");
  //     setData(response.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const { data } = useFetch("http://localhost:8000/database");

  const deleteAuto = (title) => {
    axios
      .delete(`http://localhost:8000/database/${title}`)
      .then((res) => res.data);
    navigate(0);
  };

  return (
    <Fragment>
      <NavBar />
      <h1>Database</h1>
      {data.map((cars) => {
        return (
          <div className="database-list" key={cars._id}>
            <NavLink to={cars.title} key={cars.title}>
              <p className="database-title">{cars.title}</p>
            </NavLink>
            <p className="database-desc">{cars.shortDesc}</p>
            <img className="database-image" src={cars.src} alt={cars.title} />
            <button
              className="database-delete"
              onClick={() => deleteAuto(cars.title)}
            >
              Delete
            </button>
          </div>
        );
      })}
      <Outlet />
      <Footer />
    </Fragment>
  );
};

export default DataBase;
