import { useState } from 'react'
import mazdaImg from '../../assets/images/Mazda-Car-Transparent-Background.png'
import mercedesImg from '../../assets/images/Mercedes-Benz-PNG-Photo.png'
import subaruImg from '../../assets/images/Blue-Subaru-PNG-Free-Download.png'
import opelImg from '../../assets/images/Opel-PNG-Pic.png'
import audiImg from '../../assets/images/Audi-A7-S-Line-PNG.png'
import vwImg from '../../assets/images/VW-Beetle-PNG-Transparent.png'
import styles from './SelectBrand.module.css'

const BRAND_IMAGES: Record<string, string> = {
  mazda: mazdaImg,
  mercedes: mercedesImg,
  subaru: subaruImg,
  opel: opelImg,
  audi: audiImg,
  vw: vwImg,
}

export function SelectBrand() {
  const [selected, setSelected] = useState('')

  return (
    <section id="select-brand" className={styles.selectBrand}>
      <label className={styles.title}>Select from different types of vehicles</label>
      <br />
      <select className={styles.select} value={selected} onChange={(e) => setSelected(e.target.value)}>
        <option value="">None</option>
        <option value="mazda">Mazda</option>
        <option value="mercedes">Mercedes</option>
        <option value="subaru">Subaru</option>
        <option value="opel">Opel</option>
        <option value="audi">Audi</option>
        <option value="vw">VW</option>
      </select>

      <div className={styles.imageWrapper}>
        {selected && <img className={styles.image} src={BRAND_IMAGES[selected]} alt={selected} />}
      </div>
    </section>
  )
}
