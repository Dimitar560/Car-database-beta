import { del, get, patch, post } from '../../lib/http'
import type { Car, CarInput } from '../../types'

export function getCars() {
  return get<Car[]>('/cars')
}

export function getCar(id: string) {
  return get<Car>(`/cars/${id}`)
}

export function createCar(data: CarInput) {
  return post<Car>('/cars', data)
}

export function updateCar(id: string, data: Partial<CarInput>) {
  return patch<Car>(`/cars/${id}`, data)
}

export function deleteCar(id: string) {
  return del<void>(`/cars/${id}`)
}
