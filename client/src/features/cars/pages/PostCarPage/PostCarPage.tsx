import { useNavigate } from 'react-router-dom'
import { NavBar } from '../../../../components/NavBar'
import { CarForm } from '../../components/CarForm'
import { useCreateCar } from '../../hooks'
import type { CarInput } from '../../../../types'

export function PostCarPage() {
  const navigate = useNavigate()
  const createCar = useCreateCar()

  const handleSubmit = (data: CarInput) => {
    createCar.mutate(data, {
      onSuccess: () => navigate('/database'),
    })
  }

  return (
    <>
      <NavBar />
      <h2 className="title-label">Post form</h2>
      <CarForm onSubmit={handleSubmit} submitLabel="Add" isSubmitting={createCar.isPending} />
    </>
  )
}
