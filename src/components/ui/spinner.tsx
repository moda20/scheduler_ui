// assisted by v0
import type { ReactNode } from "react"
import { useEffect, useMemo, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingOverlayProps {
  children: ReactNode
  isLoading: boolean
  icon?: LucideIcon
  iconSize?: number
  backdropOpacity?: number
  className?: string
}

export default function LoadingOverlay({
  children,
  isLoading,
  icon: Icon = Loader2,
  iconSize = 32,
  backdropOpacity = 0.5,
  className,
}: LoadingOverlayProps) {
  const [useViewportPosition, setUseViewportPosition] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkPosition = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      // If the component extends beyond the viewport, use viewport positioning
      setUseViewportPosition(rect.height > viewportHeight)
    }

    checkPosition()
    window.addEventListener("resize", checkPosition)
    window.addEventListener("scroll", checkPosition)

    return () => {
      window.removeEventListener("resize", checkPosition)
      window.removeEventListener("scroll", checkPosition)
    }
  }, [isLoading])

  const BackdropFilter = useMemo(() => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: backdropOpacity }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-gray-900 z-40 rounded-md"
      />
    )
  }, [backdropOpacity])

  const SpinnerContainer = useMemo(() => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="absolute inset-0 z-50"
        style={{
          display: "flex",
          alignItems: useViewportPosition ? "flex-start" : "center",
          justifyContent: "center",
          paddingTop: useViewportPosition ? "50vh" : "0",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            position: useViewportPosition ? "sticky" : "static",
            top: useViewportPosition ? "50vh" : "auto",
            transform: useViewportPosition ? "translateY(-50%)" : "none",
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Icon size={iconSize} className="text-foreground drop-shadow-lg" />
          </motion.div>
        </div>
      </motion.div>
    )
  }, [Icon, iconSize, useViewportPosition])

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden inline-flex w-full", className)}
    >
      {children}

      <AnimatePresence>
        {isLoading && (
          <>
            {BackdropFilter}
            {SpinnerContainer}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
