import { useCallback, useEffect, useRef, useState } from "react"

export function useInView(options = {}) {
  const [inView, setInView] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      // clear previous observer
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }

      if (node) {
        observerRef.current = new IntersectionObserver(
          ([entry]) => setInView(entry.isIntersecting),
          options,
        )
        observerRef.current.observe(node)
      }
    },
    [options],
  )

  // cleanup on unmount
  useEffect(() => {
    return () => observerRef.current?.disconnect()
  }, [])

  return { ref: setRef, inView }
}
