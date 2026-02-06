import { useHotkeys } from "react-hotkeys-hook"
import type { ButtonProps } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
import * as React from "react"
import { useImperativeHandle, useRef } from "react"

interface ButtonWithStrCutProps extends ButtonProps {
  keyBinding?: string | string[]
  onAction?: (arg0: KeyboardEvent) => void
}

const ButtonWithStrCut = React.forwardRef<
  HTMLButtonElement,
  ButtonWithStrCutProps
>(({ keyBinding, onAction, ...props }: ButtonWithStrCutProps, ref) => {
  const newRef = useRef<HTMLButtonElement>(null)
  useImperativeHandle(ref, () => newRef.current as HTMLButtonElement)
  useHotkeys(keyBinding ?? "", ev => {
    if (props.disabled) {
      return
    }
    if (onAction) {
      onAction(ev)
    }
    if (newRef.current) {
      newRef.current.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    }
  })
  return <Button ref={ref} {...props} />
})

export default ButtonWithStrCut
