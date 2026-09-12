import fancyCarImages from '../../data/fancyCarImages'
import styles from './FancyImages.module.css'

const CAPTIONS = ['Filled database', 'Awsome brands', 'Engine information']

export function FancyImages() {
  return (
    <section id="fancy-images" className={styles.fancyImages}>
      {fancyCarImages.map((fancy, index) => (
        <div className={styles.card} key={fancy.id}>
          <img className={styles.image} src={fancy.src} alt={fancy.alt} />
          <div className={styles.overlay}>
            <h4 className={styles.caption}>{CAPTIONS[index]}</h4>
          </div>
        </div>
      ))}
    </section>
  )
}
