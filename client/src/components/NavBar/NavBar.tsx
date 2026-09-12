import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth, useLogout } from '../../features/auth/hooks'
import { HamburgerButton } from '../HamburgerButton'
import styles from './NavBar.module.css'

export function NavBar() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const logout = useLogout()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMenuOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  const handleLogout = () => {
    closeMenu()
    logout.mutate(undefined, {
      onSuccess: () => navigate('/'),
    })
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link

  return (
    <nav className={styles.navibar}>
      <div className={styles.bar}>
        <h1 className={styles.brand}>Car Database</h1>
        <div className={`${styles.links} ${isMenuOpen ? styles.linksOpen : ''}`}>
          <NavLink to="/" className={linkClass} end onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/about" className={linkClass} onClick={closeMenu}>
            About
          </NavLink>
          <NavLink to="/database" className={linkClass} onClick={closeMenu}>
            Database
          </NavLink>
          {!isAuthenticated && (
            <NavLink to="/userform" className={linkClass} onClick={closeMenu}>
              Login
            </NavLink>
          )}
          {isAuthenticated && (
            <NavLink to="/postauto" className={linkClass} onClick={closeMenu}>
              Post auto
            </NavLink>
          )}
          {isAuthenticated && (
            <button className={styles.logoutButton} type="button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
        <HamburgerButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen((prev) => !prev)} />
      </div>
      <button
        type="button"
        className={`${styles.backdrop} ${isMenuOpen ? styles.backdropOpen : ''}`}
        aria-hidden={!isMenuOpen}
        aria-label="Close menu"
        onClick={closeMenu}
      />
    </nav>
  )
}
