import { ReactElement, ReactNode, useMemo } from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface ScrollableListProps<T> {
  originalList?: T[]
  loadMore?: boolean
  loadMoreAction?: (offset?: number) => Promise<T[]>
  renderItem?: (item: T, index: number) => ReactNode
  onItemClick?: (item: T, index: number) => void
  className?: string
  itemClassName?: string | ((item: T, index: number) => string)
}

export default function ScrollableList<T>({
  originalList,
  loadMoreAction,
  loadMore,
  renderItem,
  onItemClick,
  className,
  itemClassName,
}: ScrollableListProps<T>) {
  const [items, setItems] = useState<T[]>(originalList ?? [])
  const [loading, setLoading] = useState(false)
  const [currentFocusIndex, setCurrentFocusIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const loaderRef = useRef<HTMLDivElement>(null)

  const loadMoreItems = useCallback(
    async (offset: number) => {
      if (loading) return
      if (!loadMoreAction) return

      setLoading(true)
      try {
        const newItems = await loadMoreAction(offset)
        setItems(prev => [...prev, ...newItems])
        // Extend the refs array for new items
        itemRefs.current = [
          ...itemRefs.current,
          ...new Array(newItems.length).fill(null),
        ]
      } catch (error) {
        console.error("Failed to load more items:", error)
      } finally {
        setLoading(false)
      }
    },
    [loadMore, loading],
  )

  // observable usage for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && loadMore) {
          loadMoreItems(items.length)
        }
      },
      { threshold: 0.2 },
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [loadMoreItems, loading, items])

  // Auto-focus first item when component mounts and no item is focused already
  useEffect(() => {
    if (itemRefs.current[0] && items.length > 0 && currentFocusIndex === 0) {
      itemRefs.current[0]?.focus()
    }
  }, [currentFocusIndex, items.length])

  // force refresh of original list when parent changes.
  useEffect(() => {
    if (!items.length) {
      setItems(originalList ?? [])
    }
  }, [items, originalList])

  const focusItem = (newIndex: number) => {
    setCurrentFocusIndex(newIndex)
    itemRefs.current[newIndex]?.focus()
    // Smooth scroll to keep the focused item in view
    itemRefs.current[newIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    })
  }
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let newIndex = index
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        newIndex = Math.min(index + 1, items.length - 1)
        break
      case "ArrowUp":
        e.preventDefault()
        newIndex = Math.max(index - 1, 0)
        break
      case "Home":
        e.preventDefault()
        newIndex = 0
        break
      case "End":
        e.preventDefault()
        newIndex = items.length - 1
        break
      case "PageDown":
        e.preventDefault()
        newIndex = Math.min(index + 5, items.length - 1)
        break
      case "PageUp":
        e.preventDefault()
        newIndex = Math.max(index - 5, 0)
        break
      case "Enter":
        itemHandlers[index]()
        break
      default:
        return // Don't handle other keys
    }

    // Focus the new item
    if (newIndex !== index && itemRefs.current[newIndex]) {
      focusItem(newIndex)
    }
  }

  const handleFocus = (index: number) => {
    setCurrentFocusIndex(index)
  }

  const itemClassNameString = (item: T, index: number) => {
    return typeof itemClassName === "function"
      ? itemClassName(item, index)
      : itemClassName
  }

  const handleItemSelection = useCallback(
    (item: any, index: number) => {
      setCurrentFocusIndex(index)
      itemRefs.current[index]?.focus()
      onItemClick?.(item, index)
    },
    [onItemClick],
  )

  const itemHandlers = useMemo(
    () => items.map((_, index) => () => handleItemSelection(_, index)),
    [items, handleItemSelection],
  )

  return (
    <div
      className={cn("flex flex-col gap-2 listbox-area", className)}
      ref={containerRef}
      role="listbox"
      aria-label="Item list"
    >
      {items.map((item, index) => {
        return (
          <div
            key={index}
            className={cn(
              "focus-visible:outline-none",
              itemClassNameString(item, index),
            )}
            role="option"
            ref={el => (itemRefs.current[index] = el)}
            aria-selected={currentFocusIndex === index}
            tabIndex={currentFocusIndex === index ? 0 : -1}
            onKeyDown={e => handleKeyDown(e, index)}
            onFocus={() => handleFocus(index)}
            onClick={itemHandlers[index]}
          >
            {renderItem ? renderItem(item, index) : item?.toString()}
          </div>
        )
      })}

      <div
        ref={loaderRef}
        className={cn(
          "flex items-center justify-center py-8",
          loading ? "opacity-100" : "opacity-0",
        )}
      >
        {loading && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading previous runs...</span>
          </div>
        )}
      </div>
    </div>
  )
}
