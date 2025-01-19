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
import { Button } from "@/components/ui/button"
import type * as React from "react"

export enum ConfirmationDialogActionType {
  CONFIRM,
  CANCEL,
}

export interface ConfirmationDialogActionProps {
  children: React.ReactNode
  title: string
  description: string
  takeAction: (arg: ConfirmationDialogActionType) => void
  cancelText?: string
  confirmText?: string
}

export default function ConfirmationDialogAction(
  props: ConfirmationDialogActionProps,
) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>
      <AlertDialogContent className={"text-foreground bg-background"}>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          <AlertDialogDescription>{props.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            title={props.cancelText ?? "Cancel"}
            onClick={() =>
              props.takeAction(ConfirmationDialogActionType.CANCEL)
            }
          >
            {props.cancelText ?? "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            title={props.confirmText ?? "Confirm"}
            onClick={() =>
              props.takeAction(ConfirmationDialogActionType.CONFIRM)
            }
          >
            {props.confirmText ?? "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
