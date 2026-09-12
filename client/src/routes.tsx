import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { ErrorPage } from './components/ErrorPage'
import { DatabasePage } from './features/cars/pages/DatabasePage'
import { DetailedInfoPage } from './features/cars/pages/DetailedInfoPage'
import { PostCarPage } from './features/cars/pages/PostCarPage'
import { EditCarPage } from './features/cars/pages/EditCarPage'
import { UserFormPage } from './features/auth/pages/UserFormPage'
import { ProtectedRoute } from './features/auth/components/ProtectedRoute'

export function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="database" element={<DatabasePage />} />
      <Route path="database/:id" element={<DetailedInfoPage />} />
      <Route
        path="postauto"
        element={
          <ProtectedRoute>
            <PostCarPage />
          </ProtectedRoute>
        }
      />
      <Route path="userform" element={<UserFormPage />} />
      <Route
        path="database/update/:id"
        element={
          <ProtectedRoute>
            <EditCarPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}
