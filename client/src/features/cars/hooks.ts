import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCar, deleteCar, getCar, getCars, updateCar } from './api'
import type { CarInput } from '../../types'

const CARS_KEY = ['cars']
const carKey = (id: string) => ['cars', id]

export function useCars() {
  return useQuery({ queryKey: CARS_KEY, queryFn: getCars })
}

export function useCar(id: string) {
  return useQuery({ queryKey: carKey(id), queryFn: () => getCar(id), enabled: Boolean(id) })
}

export function useCreateCar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CarInput) => createCar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARS_KEY })
    },
  })
}

export function useUpdateCar(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CarInput>) => updateCar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARS_KEY })
      queryClient.invalidateQueries({ queryKey: carKey(id) })
    },
  })
}

export function useDeleteCar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARS_KEY })
    },
  })
}
