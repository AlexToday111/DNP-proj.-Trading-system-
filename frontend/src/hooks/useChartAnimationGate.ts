import { useEffect, useState } from 'react'

export function useChartAnimationGate(animateOnMount: boolean) {
  const [isAnimationActive, setIsAnimationActive] = useState(animateOnMount)

  useEffect(() => {
    if (isAnimationActive) return undefined

    const frameId = window.requestAnimationFrame(() => {
      setIsAnimationActive(true)
    })

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [isAnimationActive])

  return isAnimationActive
}
