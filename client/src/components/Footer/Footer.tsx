import facebookIcon from '../../assets/icons/facebook.png'
import instagramIcon from '../../assets/icons/instagram.png'
import twitterIcon from '../../assets/icons/twitter.png'
import styles from './Footer.module.css'

export function Footer() {
  const year = new Date().toLocaleDateString('en-BG', { year: 'numeric' })

  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>Copyright &copy; D.C {year}</p>
      <br />
      <img className={`${styles.icon} ${styles.iconFacebook}`} src={facebookIcon} alt="Facebook" />
      <img className={`${styles.icon} ${styles.iconInstagram}`} src={instagramIcon} alt="Instagram" />
      <img className={`${styles.icon} ${styles.iconTwitter}`} src={twitterIcon} alt="Twitter" />
    </footer>
  )
}
