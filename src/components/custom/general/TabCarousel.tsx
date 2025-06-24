// assisted by v0

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface TabCarouselProps {
  defaultValue?: string
  className?: string
  children?: React.ReactNode
}

export default function TabCarousel({ children }: TabCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }

  const scrollLeft = () => {
    if (!scrollContainerRef.current) return
    const scrollAmount = scrollContainerRef.current.clientWidth * 0.8
    scrollContainerRef.current.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    })
  }

  const scrollRight = () => {
    if (!scrollContainerRef.current) return
    const scrollAmount = scrollContainerRef.current.clientWidth * 0.8
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    checkScrollButtons()

    const handleScroll = () => checkScrollButtons()
    const handleResize = () => checkScrollButtons()

    container.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)

    return () => {
      container.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="relative flex items-center">
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute left-1 z-20 h-9 w-9 rounded-lg bg-background/80 backdrop-blur-sm shadow-lg border-2 border-border",
          !canScrollLeft && "opacity-30 cursor-not-allowed",
        )}
        onClick={scrollLeft}
        disabled={!canScrollLeft}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex-1 mx-6 overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide w-full"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {children}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute right-1 z-20 h-9 w-9 rounded-lg bg-background/80 backdrop-blur-sm shadow-lg border-2 border-border",
          !canScrollRight && "opacity-30 cursor-not-allowed",
        )}
        onClick={scrollRight}
        disabled={!canScrollRight}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
