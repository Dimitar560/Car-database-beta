import { useMemo, useState } from 'react'
import { NavBar } from '../../../../components/NavBar'
import { useAuth } from '../../../auth/hooks'
import { useCars, useDeleteCar } from '../../hooks'
import { CarCard } from '../../components/CarCard'
import styles from './DatabasePage.module.css'

export function DatabasePage() {
  const { isAuthenticated } = useAuth()
  const { data: cars, isLoading } = useCars()
  const deleteCar = useDeleteCar()
  const [searchInput, setSearchInput] = useState('')

  const filteredCars = useMemo(() => {
    if (!cars) return []
    const query = searchInput.trim().toLowerCase()
    if (query === '') return cars
    return cars.filter((car) => Object.values(car).join(' ').toLowerCase().includes(query))
  }, [cars, searchInput])

  const handleDelete = (id: string) => {
    deleteCar.mutate(id)
  }

  return (
    <>
      <NavBar />
      <h1 className="title-label">Database</h1>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search here"
          className={styles.searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {isLoading && <p>Loading...</p>}

      {!isLoading && filteredCars.length === 0 && <p className={styles.empty}>No cars found.</p>}

      {!isLoading && filteredCars.length > 0 && (
        <div className={styles.grid}>
          {filteredCars.map((car) => (
            <CarCard key={car._id} car={car} isAuthenticated={isAuthenticated} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </>
  )
}
