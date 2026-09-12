import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMe, login, logout, register } from './api'
import type { Credentials } from '../../types'

const ME_QUERY_KEY = ['auth', 'me']

export function useAuth() {
  const query = useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  return {
    user: query.data?.user ?? null,
    isAuthenticated: Boolean(query.data?.user),
    isLoading: query.isLoading,
  }
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (credentials: Credentials) => login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(ME_QUERY_KEY, data)
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (credentials: Credentials) => register(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(ME_QUERY_KEY, data)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })
    },
  })
}
