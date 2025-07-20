import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { buttonVariants } from "@/components/ui/button"
import type * as React from "react"
import type { VariantProps } from "class-variance-authority"
import useDialogueManager from "@/hooks/useDialogManager"
import { useCallback, useRef } from "react"

export enum ConfirmationDialogActionType {
  CONFIRM,
  CANCEL,
}

export interface ConfirmationDialogActionProps {
  children: React.ReactNode
  title: string
  description: string | React.ReactNode
  cancelText?: string
  confirmText?: string
  confirmVariant?: VariantProps<typeof buttonVariants>["variant"]
  cancelVariant?: VariantProps<typeof buttonVariants>["variant"]
  takeAction: (arg: ConfirmationDialogActionType, ...rest: any) => void
  onOpenChange?: (open: boolean) => void
  disableConfirm?: boolean
  extraTakeActionArgs?: any
  autoFocus?: boolean
}

export default function ConfirmationDialogAction(
  props: ConfirmationDialogActionProps,
) {
  const { isDialogOpen, setDialogState } = useDialogueManager()
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  const setDialogStateWithFocus = useCallback(
    (open: boolean, onOpenChange?: (open: boolean) => void) => {
      setDialogState(open, onOpenChange)
      if (open && props.autoFocus) {
        setTimeout(() => {
          cancelButtonRef.current?.focus()
        }, 100)
      }
    },
    [setDialogState, props.onOpenChange, isDialogOpen, props.autoFocus],
  )
  return (
    <AlertDialog
      open={isDialogOpen}
      onOpenChange={v => setDialogStateWithFocus(v, props.onOpenChange)}
    >
      <AlertDialogTrigger
        onClick={() => setDialogStateWithFocus(true, props.onOpenChange)}
        asChild
      >
        {props.children}
      </AlertDialogTrigger>
      <AlertDialogContent
        onEscapeKeyDown={e => {
          e.preventDefault()
          setDialogState(false, props.onOpenChange)
        }}
        className={"text-foreground bg-background"}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          <AlertDialogDescription>{props.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            title={props.cancelText ?? "Cancel"}
            onClick={() =>
              props.takeAction(
                ConfirmationDialogActionType.CANCEL,
                ...(props?.extraTakeActionArgs ?? []),
              )
            }
            variant={props.cancelVariant}
          >
            {props.cancelText ?? "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            ref={cancelButtonRef}
            title={props.confirmText ?? "Confirm"}
            onClick={() =>
              props.takeAction(
                ConfirmationDialogActionType.CONFIRM,
                ...(props?.extraTakeActionArgs ?? []),
              )
            }
            variant={props.confirmVariant}
            disabled={props.disableConfirm}
            autoFocus={true}
            tabIndex={0}
          >
            {props.confirmText ?? "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
