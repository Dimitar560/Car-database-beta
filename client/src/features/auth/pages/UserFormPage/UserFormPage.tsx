import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar } from '../../../../components/NavBar'
import { useLogin, useRegister } from '../../hooks'
import { HttpError } from '../../../../lib/http'
import styles from './UserFormPage.module.css'

export function UserFormPage() {
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()

  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const mutation = isLogin ? loginMutation : registerMutation

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault()
    const username = usernameRef.current!.value
    const password = passwordRef.current!.value

    mutation.mutate(
      { username, password },
      {
        onSuccess: () => {
          navigate('/')
        },
      }
    )
  }

  const errorMessage =
    mutation.error instanceof HttpError ? mutation.error.message : mutation.error ? 'Something went wrong' : null

  return (
    <>
      <NavBar />
      <form className={styles.userForm} onSubmit={submitHandler}>
        <h3>{isLogin ? 'Login form' : 'Register form'}</h3>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" ref={usernameRef} required />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordRef} required minLength={6} />
        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
        {!mutation.isPending && (
          <button className={styles.loginButton} type="submit">
            {isLogin ? 'Login' : 'Register'}
          </button>
        )}
        {mutation.isPending && <p>Loading...</p>}
        <button
          className={styles.loginButton}
          type="button"
          onClick={() => setIsLogin((prev) => !prev)}
        >
          {isLogin ? 'Create new account' : 'Login with existing account'}
        </button>
      </form>
    </>
  )
}
