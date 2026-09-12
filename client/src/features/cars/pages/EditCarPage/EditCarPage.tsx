import { useNavigate, useParams } from 'react-router-dom'
import { NavBar } from '../../../../components/NavBar'
import { CarForm } from '../../components/CarForm'
import { useCar, useUpdateCar } from '../../hooks'
import type { CarInput } from '../../../../types'

export function EditCarPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: car, isLoading } = useCar(id ?? '')
  const updateCar = useUpdateCar(id ?? '')

  const handleSubmit = (data: CarInput) => {
    updateCar.mutate(data, {
      onSuccess: () => navigate('/database'),
    })
  }

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
      <h2 className="title-label">Edit form</h2>
      <CarForm initialValues={car} onSubmit={handleSubmit} submitLabel="Edit" isSubmitting={updateCar.isPending} />
    </>
  )
}
