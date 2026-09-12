import { get, post } from '../../lib/http'
import type { Credentials, User } from '../../types'

export function getMe() {
  return get<{ user: User }>('/auth/me')
}

export function register(credentials: Credentials) {
  return post<{ user: User }>('/auth/register', credentials)
}

export function login(credentials: Credentials) {
  return post<{ user: User }>('/auth/login', credentials)
}

export function logout() {
  return post<void>('/auth/logout')
}
