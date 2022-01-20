import { Carousel } from "react-bootstrap";
import carouselItem from "../javaScript/carouselItems";
import "../styles/CarouselCar.css";

const CarouselCar = () => {
  const CarouselGen = (car) => {
    return (
      <Carousel.Item key={car.id}>
        <img
          className="d-block w-100 carousel-cars"
          src={car.src}
          alt={car.alt}
        />
        <Carousel.Caption className="arrows">
          <h3 className="image-title">{car.title}</h3>
          <p className="image-text">
            Nulla vitae elit libero, a pharetra augue mollis interdum.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    );
  };

  return (
    <section id="carousel">
      <Carousel interval={5000} fade>
        {carouselItem.map(CarouselGen)}
      </Carousel>
    </section>
  );
};

export default CarouselCar;
