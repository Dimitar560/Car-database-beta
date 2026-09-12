import { useParams } from 'react-router-dom'
import { NavBar } from '../../../../components/NavBar'
import { useCar } from '../../hooks'
import styles from './DetailedInfoPage.module.css'

export function DetailedInfoPage() {
  const { id } = useParams<{ id: string }>()
  const { data: car, isLoading } = useCar(id ?? '')

  if (isLoading) {
    return (
      <>
        <NavBar />
        <p>Loading...</p>
      </>
    )
  }

  if (!car) {
    return (
      <>
        <NavBar />
        <p>Car not found.</p>
      </>
    )
  }

  return (
    <>
      <NavBar />
      <div className={styles.detailSection}>
        <h2 className={styles.title}>{car.title}</h2>
        <p className={styles.text}>{car.shortDesc}</p>
        <img className={styles.image} src={car.src} alt={car.title} />
        <h3 className={styles.price}>
          Prices start from: <span className={styles.green}>${car.priceFrom}</span> to:{' '}
          <span className={styles.green}>${car.priceTo}</span>
        </h3>
        <h3 className={styles.desc}>Types of engines:</h3>
        <p>{car.fuelTypes.length > 0 ? car.fuelTypes.join(', ') : 'Not specified'}</p>
        <h3 className={styles.desc}>Types of vehicles:</h3>
        <p>{car.bodyStyles.length > 0 ? car.bodyStyles.join(', ') : 'Not specified'}</p>
      </div>
    </>
  )
}
