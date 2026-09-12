import { Link } from 'react-router-dom'
import type { Car } from '../../../../types'
import styles from './CarCard.module.css'

interface CarCardProps {
  car: Car
  isAuthenticated: boolean
  onDelete: (id: string) => void
}

export function CarCard({ car, isAuthenticated, onDelete }: CarCardProps) {
  return (
    <div className={styles.card}>
      <img className={styles.image} src={car.src} alt={car.title} />
      <div className={styles.body}>
        <Link to={car._id} className={styles.title}>
          {car.title}
        </Link>
        <p className={styles.desc}>{car.shortDesc.substring(0, 220)}...</p>
        {isAuthenticated && (
          <div className={styles.actions}>
            <button className={styles.actionButton} onClick={() => onDelete(car._id)}>
              Delete
            </button>
            <Link to={`update/${car._id}`}>
              <button className={styles.actionButton}>Edit</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
