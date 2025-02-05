import type { ButtonProps } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
import { useHotkeys } from "react-hotkeys-hook"
import { useRef } from "react"

export interface HotKeyButtonProps extends ButtonProps {
  hotKey?: string | string[]
}

export default function HotKeyButton(props: HotKeyButtonProps) {
  const { hotKey, ...rest } = props
  let ref = useRef<HTMLButtonElement>(null)

  useHotkeys(
    hotKey ?? [],
    event => {
      if (rest.onClick) {
        const newEvent = new Event("click", {
          bubbles: true,
          cancelable: true,
        })
        ref.current?.dispatchEvent(newEvent)
      }
    },
    {
      preventDefault: true,
    },
  )
  return <Button ref={ref} {...rest}></Button>
}
