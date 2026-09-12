import styles from './HamburgerButton.module.css'

interface HamburgerButtonProps {
  isOpen: boolean
  onClick: () => void
}

export function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
  return (
    <button
      className={styles.menuToggle}
      type="button"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      onClick={onClick}
    >
      <span className={`${styles.menuIcon} ${isOpen ? styles.menuIconOpen : ''}`} />
    </button>
  )
}
