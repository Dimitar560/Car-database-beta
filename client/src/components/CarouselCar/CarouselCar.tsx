import carouselItems from '../../data/carouselItems'
import { Carousel } from '../Carousel'
import styles from './CarouselCar.module.css'

export function CarouselCar() {
  return (
    <section id="carousel">
      <Carousel autoPlay autoPlayInterval={5000} draggable>
        {carouselItems.map((car) => (
          <div key={car.id} className={styles.slideContent}>
            <img className={styles.image} src={car.src} alt={car.alt} />
            <div className={styles.caption}>
              <h3 className={styles.title}>{car.title}</h3>
              <p className={styles.text}>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  )
}
