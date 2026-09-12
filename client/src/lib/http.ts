import axios, { AxiosError } from 'axios'
import type { ApiError } from '../types'

const client = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

export class HttpError extends Error {
  status: number
  code: string
  details?: ApiError['error']['details']

  constructor(status: number, code: string, message: string, details?: ApiError['error']['details']) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
    this.details = details
  }
}

function unwrap(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>
    const body = axiosError.response?.data
    if (body?.error) {
      throw new HttpError(
        axiosError.response?.status ?? 0,
        body.error.code,
        body.error.message,
        body.error.details
      )
    }
  }
  throw error
}

export async function get<T>(url: string): Promise<T> {
  try {
    const res = await client.get<T>(url)
    return res.data
  } catch (error) {
    unwrap(error)
  }
}

export async function post<T>(url: string, data?: unknown): Promise<T> {
  try {
    const res = await client.post<T>(url, data)
    return res.data
  } catch (error) {
    unwrap(error)
  }
}

export async function patch<T>(url: string, data?: unknown): Promise<T> {
  try {
    const res = await client.patch<T>(url, data)
    return res.data
  } catch (error) {
    unwrap(error)
  }
}

export async function del<T>(url: string): Promise<T> {
  try {
    const res = await client.delete<T>(url)
    return res.data
  } catch (error) {
    unwrap(error)
  }
}
