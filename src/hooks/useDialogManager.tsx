import { useState, useCallback, useId, useContext } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import {
  closeAllGroupedDialogs,
  closeTopDialog,
  dialogStack,
  openDialog,
} from "@/app/reducers/uiReducer"
import { ReactReduxContext } from "react-redux"
import { useHotkeys } from "react-hotkeys-hook"
import type { Store } from "redux"

export interface DialogueManagerProps {
  enableEscapeHotKey?: boolean
  inputGroup?: string
}

function useDialogueManager({
  enableEscapeHotKey = false,
  inputGroup,
}: DialogueManagerProps = {}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const dispatch = useAppDispatch()
  const currentStack = useAppSelector(dialogStack)
  const cptId = useId()
  const { store } = useContext(ReactReduxContext) as {
    store: Store
  }
  useHotkeys("esc", () => {
    if (enableEscapeHotKey) {
      setDialogState(false)
    }
  })

  const canClose = (dialog: string, canBeDirectClosed: boolean = false) => {
    const stack = store.getState().ui.dialogStack
    const groupStack = store.getState().ui.dialogGroups
    return (
      stack.length > 0 &&
      ((canBeDirectClosed &&
        inputGroup &&
        (!groupStack[inputGroup] ||
          !groupStack[inputGroup].includes(dialog))) ||
        stack[stack.length - 1] === dialog)
    )
  }

  const updateDialogState = (
    open: boolean,
    callback?: (open: boolean) => void,
  ) => {
    if (open) {
      if (inputGroup) {
        dispatch(closeAllGroupedDialogs(inputGroup))
      }
      dispatch(openDialog({ cptId, group: inputGroup }))
      setIsDialogOpen(open)
      if (callback) {
        callback(open)
      }
    } else {
      if (canClose(cptId, !!inputGroup)) {
        setIsDialogOpen(open)
        isDialogOpen && dispatch(closeTopDialog(inputGroup ? cptId : undefined))
        if (callback) {
          callback(open)
        }
      }
    }
  }

  const setDialogState = useCallback(
    (open: boolean, callback?: (open: boolean) => void) => {
      updateDialogState(open, callback)
    },
    [updateDialogState, isDialogOpen, currentStack],
  )

  return {
    setDialogState,
    isDialogOpen,
  }
}

export default useDialogueManager
