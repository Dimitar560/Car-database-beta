import styles from './ExtraDetails.module.css'

export function ExtraDetails() {
  return (
    <section className={styles.extraDetails}>
      <h3 className={styles.title}>
        There is e<span className={styles.otherSide}>ven more.</span>
        <br />
        Information on old
        <span className={styles.otherSide}> but gold machines.</span>
      </h3>
      <img
        className={styles.image}
        src="https://live.staticflickr.com/65535/49552961191_927f5ffcd4_b.jpg"
        alt="mustang"
      />
      <p className={styles.text}>
        A classic car is an older car, typically 25 years or older, though definitions vary. The common theme is of
        an older car of historical interest to be collectible and tend to be restored rather than scrapped. Classic
        cars are a subset of a broader category of &quot;collector cars&quot;. A subset of what is considered
        classic cars are known as antique cars or vintage cars. Organizations such as the Classic Car Club of
        America maintain lists of eligible unmodified cars that are called &quot;classic&quot;. These are described
        as &quot;fine&quot; or &quot;distinctive&quot; automobile, either American or foreign built, produced
        between 1915 and 1948.
      </p>
    </section>
  )
}
