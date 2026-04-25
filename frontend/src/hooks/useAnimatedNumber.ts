import { useEffect, useRef, useState } from 'react'

export function useAnimatedNumber(value: number, durationMs = 700) {
  const [displayValue, setDisplayValue] = useState(value)
  const previousValue = useRef(value)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setDisplayValue(value)
      previousValue.current = value
      return
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion || previousValue.current === value) {
      setDisplayValue(value)
      previousValue.current = value
      return
    }

    const startValue = previousValue.current
    const change = value - startValue
    const startTime = window.performance.now()
    let frameId = 0

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      setDisplayValue(startValue + change * easedProgress)

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
      } else {
        previousValue.current = value
      }
    }

    frameId = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [durationMs, value])

  return displayValue
}
