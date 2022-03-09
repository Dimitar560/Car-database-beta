import { Fragment, useState } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import axios from "axios";
import "../styles/DataBase.css";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import { Card, Row, Col } from "react-bootstrap";

const DataBase = () => {
  const isAuth = useSelector((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const [filtredResult, setFiltredResult] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const { data, loading } = useFetch("http://localhost:8000/database");

  const deleteAuto = (title) => {
    axios
      .delete(`http://localhost:8000/database/${title}`)
      .then((res) => res.data)
      .finally(() => navigate("/database"));
  };

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    if (searchInput !== "") {
      const filteredData = data.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(searchInput.toLowerCase());
      });
      setFiltredResult(filteredData);
    } else {
      setFiltredResult(data);
    }
  };

  return (
    <Fragment>
      <NavBar />
      <h1>Database</h1>
      <input
        type="text"
        placeholder="Search here"
        onChange={(e) => searchItems(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      {!loading && (
        <Row xs={1} md={2} lg={4} className="g-0">
          {searchInput.length > 1
            ? filtredResult.map((cars) => {
                return (
                  <Col key={cars._id}>
                    <Card
                      className="database-list"
                      key={cars._id}
                      style={{ width: "18rem" }}
                    >
                      <Card.Img
                        style={{ height: "10rem" }}
                        variant="top"
                        src={cars.src}
                        alt={cars.title}
                      />
                      <Card.Body>
                        <NavLink to={cars.title} key={cars.title}>
                          <Card.Title className="database-title">
                            {cars.title}
                          </Card.Title>
                        </NavLink>
                        <Card.Text className="database-desc">
                          {cars.shortDesc.substring(0, 220) + "..."}
                        </Card.Text>

                        {isAuth && (
                          <button
                            className="database-delete"
                            onClick={() => deleteAuto(cars.title)}
                          >
                            Delete
                          </button>
                        )}
                        {isAuth && (
                          <NavLink to={`update/${cars.title}`}>
                            <button className="database-delete">Edit</button>
                          </NavLink>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })
            : data.map((cars) => {
                return (
                  <Col key={cars._id}>
                    <Card
                      className="database-list"
                      key={cars._id}
                      style={{ width: "18rem" }}
                    >
                      <Card.Img
                        style={{ height: "10rem" }}
                        variant="top"
                        src={cars.src}
                        alt={cars.title}
                      />
                      <Card.Body>
                        <NavLink to={cars.title} key={cars.title}>
                          <Card.Title className="database-title">
                            {cars.title}
                          </Card.Title>
                        </NavLink>
                        <Card.Text className="database-desc">
                          {cars.shortDesc.substring(0, 220) + "..."}
                        </Card.Text>

                        {isAuth && (
                          <button
                            className="database-delete"
                            onClick={() => deleteAuto(cars.title)}
                          >
                            Delete
                          </button>
                        )}
                        {isAuth && (
                          <NavLink to={`update/${cars.title}`}>
                            <button className="database-delete">Edit</button>
                          </NavLink>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
        </Row>
      )}
      <Outlet />
      <Footer />
    </Fragment>
  );
};

export default DataBase;
