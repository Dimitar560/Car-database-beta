import { useNavigate } from 'react-router-dom'
import { NavBar } from '../NavBar'

export function ErrorPage() {
  const navigate = useNavigate()

  return (
    <>
      <NavBar />
      <h1>404 Page Not Found</h1>
      <button type="button" onClick={() => navigate(-1)}>
        Please go back
      </button>
    </>
  )
}
