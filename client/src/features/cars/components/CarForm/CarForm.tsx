import { useState, type FormEvent } from 'react'
import { BODY_STYLES, FUEL_TYPES, type BodyStyle, type CarInput, type FuelType } from '../../../../types'
import styles from './CarForm.module.css'

interface CarFormProps {
  initialValues?: Partial<CarInput>
  onSubmit: (data: CarInput) => void
  submitLabel: string
  isSubmitting?: boolean
}

const BODY_STYLE_LABELS: Record<BodyStyle, string> = {
  sedan: 'Sedan',
  coupe: 'Coupe',
  wagon: 'Wagon',
  hatchback: 'Hatchback',
  suv: 'SUV',
  minivan: 'Minivan',
  pickup: 'Pickup truck',
}

const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  petrol: 'Petrol',
  diesel: 'Diesel',
  electric: 'Electric',
}

export function CarForm({ initialValues, onSubmit, submitLabel, isSubmitting }: CarFormProps) {
  const [src, setSrc] = useState(initialValues?.src ?? '')
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [shortDesc, setShortDesc] = useState(initialValues?.shortDesc ?? '')
  const [priceFrom, setPriceFrom] = useState(initialValues?.priceFrom?.toString() ?? '')
  const [priceTo, setPriceTo] = useState(initialValues?.priceTo?.toString() ?? '')
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>(initialValues?.fuelTypes ?? [])
  const [bodyStyles, setBodyStyles] = useState<BodyStyle[]>(initialValues?.bodyStyles ?? [])

  const toggleFuelType = (value: FuelType) => {
    setFuelTypes((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }

  const toggleBodyStyle = (value: BodyStyle) => {
    setBodyStyles((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({
      src,
      title,
      shortDesc,
      priceFrom: Number(priceFrom),
      priceTo: Number(priceTo),
      fuelTypes,
      bodyStyles,
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="title">Auto Name</label>
      <br />
      <input
        className={styles.inputText}
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Type..."
        required
      />
      <br />
      <label htmlFor="shortDesc">Short description</label>
      <br />
      <textarea
        id="shortDesc"
        rows={3}
        cols={70}
        value={shortDesc}
        onChange={(e) => setShortDesc(e.target.value)}
        placeholder="Type..."
        required
      />
      <br />
      <label htmlFor="src">Photo src</label>
      <br />
      <input
        className={styles.inputText}
        type="text"
        id="src"
        value={src}
        onChange={(e) => setSrc(e.target.value)}
        placeholder="Type..."
        required
      />
      <br />
      <label htmlFor="priceFrom">Price range from</label>
      <input
        className={styles.formFromTo}
        type="number"
        id="priceFrom"
        value={priceFrom}
        onChange={(e) => setPriceFrom(e.target.value)}
        placeholder="Type..."
        required
      />
      <label htmlFor="priceTo">To</label>
      <input
        className={styles.formFromTo}
        type="number"
        id="priceTo"
        value={priceTo}
        onChange={(e) => setPriceTo(e.target.value)}
        placeholder="Type..."
        required
      />
      <br />
      <label>Types of engines:</label>
      {FUEL_TYPES.map((value) => (
        <label className={styles.checkboxLabel} key={value}>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={fuelTypes.includes(value)}
            onChange={() => toggleFuelType(value)}
          />
          {FUEL_TYPE_LABELS[value]}
        </label>
      ))}
      <br />
      <label>Types of vehicles:</label>
      {BODY_STYLES.map((value) => (
        <label className={styles.checkboxLabel} key={value}>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={bodyStyles.includes(value)}
            onChange={() => toggleBodyStyle(value)}
          />
          {BODY_STYLE_LABELS[value]}
        </label>
      ))}
      <br />
      <button type="submit" disabled={isSubmitting}>
        {submitLabel}
      </button>
    </form>
  )
}
