import type { ReactNode } from 'react'
import { useCarousel } from '../../hooks/useCarousel'
import styles from './Carousel.module.css'

interface CarouselProps {
  children: ReactNode[]
  /** Auto-advance slides on a timer. Off by default. */
  autoPlay?: boolean
  /** Milliseconds between auto-advances (only relevant when autoPlay is on). */
  autoPlayInterval?: number
  /** Allow dragging (mouse/touch) to move between slides. Off by default. */
  draggable?: boolean
  /** Wrap from the last slide back to the first (and vice versa). On by default. */
  loop?: boolean
}

export function Carousel({ children, autoPlay = false, autoPlayInterval = 5000, draggable = false, loop = true }: CarouselProps) {
  const { trackRef, isDragging, scrollByOne, containerHandlers, trackHandlers } = useCarousel({
    slideCount: children.length,
    autoPlay,
    autoPlayInterval,
    draggable,
    loop,
  })

  return (
    <div className={styles.carousel} {...containerHandlers}>
      <button className={styles.prev} type="button" onClick={() => scrollByOne(-1)} aria-label="Previous slide">
        &#8249;
      </button>
      <div
        className={[styles.track, draggable && styles.draggable, isDragging && styles.dragging]
          .filter(Boolean)
          .join(' ')}
        ref={trackRef}
        {...trackHandlers}
      >
        {children.map((child, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className={styles.slide} key={index}>
            {child}
          </div>
        ))}
      </div>
      <button className={styles.next} type="button" onClick={() => scrollByOne(1)} aria-label="Next slide">
        &#8250;
      </button>
    </div>
  )
}
