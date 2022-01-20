import NavBar from "../components/NavBar";
import CarouselCar from "../components/CarouselCar";
import SelectBrand from "../components/SelectBrand";
import FancyImages from "../components/FancyImages";
import { Fragment } from "react";
import ExtraDetails from "../components/ExtraDetails";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <Fragment>
      <NavBar />
      <CarouselCar />
      <SelectBrand />
      <FancyImages />
      <ExtraDetails />
      <Footer />
    </Fragment>
  );
};

export default Home;
