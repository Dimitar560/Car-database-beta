export const FUEL_TYPES = ['petrol', 'diesel', 'electric'] as const
export type FuelType = (typeof FUEL_TYPES)[number]

export const BODY_STYLES = [
  'sedan',
  'coupe',
  'wagon',
  'hatchback',
  'suv',
  'minivan',
  'pickup',
] as const
export type BodyStyle = (typeof BODY_STYLES)[number]

export interface Car {
  _id: string
  src: string
  title: string
  shortDesc: string
  priceFrom: number
  priceTo: number
  fuelTypes: FuelType[]
  bodyStyles: BodyStyle[]
}

export type CarInput = Omit<Car, '_id'>

export interface User {
  id: string
  username: string
}

export interface Credentials {
  username: string
  password: string
}

export interface ApiError {
  error: {
    code: string
    message: string
    details?: {
      formErrors: string[]
      fieldErrors: Record<string, string[]>
    }
    requestId?: string
  }
}
