import { useEffect, useRef, useState, type DragEvent, type PointerEvent as ReactPointerEvent } from 'react'

interface UseCarouselOptions {
  slideCount: number
  /** Auto-advance slides on a timer. Off by default. */
  autoPlay?: boolean
  /** Milliseconds between auto-advances (only relevant when autoPlay is on). */
  autoPlayInterval?: number
  /** Allow dragging (mouse/touch) to move between slides. Off by default. */
  draggable?: boolean
  /** Wrap from the last slide back to the first (and vice versa). On by default. */
  loop?: boolean
}

export function useCarousel({
  slideCount,
  autoPlay = false,
  autoPlayInterval = 5000,
  draggable = false,
  loop = true,
}: UseCarouselOptions) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragState = useRef<{ startX: number; startScrollLeft: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const getCurrentIndex = () => {
    const track = trackRef.current
    if (!track || track.clientWidth === 0) return 0
    return Math.round(track.scrollLeft / track.clientWidth)
  }

  const resolveIndex = (index: number) => {
    if (loop) {
      return ((index % slideCount) + slideCount) % slideCount
    }
    return Math.min(Math.max(index, 0), slideCount - 1)
  }

  const scrollToIndex = (index: number, behavior: ScrollBehavior = 'smooth') => {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: resolveIndex(index) * track.clientWidth, behavior })
  }

  const scrollByOne = (direction: 1 | -1) => {
    scrollToIndex(getCurrentIndex() + direction)
  }

  useEffect(() => {
    if (!autoPlay || isDragging || isHovering || slideCount <= 1) return undefined

    const id = window.setInterval(() => {
      const next = getCurrentIndex() + 1
      if (!loop && next >= slideCount) {
        window.clearInterval(id)
        return
      }
      scrollToIndex(next)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, autoPlayInterval)

    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, autoPlayInterval, isDragging, isHovering, slideCount, loop])

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggable) return
    const track = trackRef.current
    if (!track) return
    track.setPointerCapture(e.pointerId)
    dragState.current = { startX: e.clientX, startScrollLeft: track.scrollLeft }
    setIsDragging(true)
  }

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggable || !dragState.current) return
    const track = trackRef.current
    if (!track) return
    const delta = e.clientX - dragState.current.startX
    track.scrollLeft = dragState.current.startScrollLeft - delta
  }

  const endDrag = () => {
    if (!draggable || !dragState.current) return
    dragState.current = null
    setIsDragging(false)
    scrollToIndex(getCurrentIndex())
  }

  return {
    trackRef,
    isDragging,
    scrollByOne,
    containerHandlers: {
      onMouseEnter: () => setIsHovering(true),
      onMouseLeave: () => setIsHovering(false),
    },
    trackHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onDragStart: (e: DragEvent<HTMLDivElement>) => e.preventDefault(),
    },
  }
}
