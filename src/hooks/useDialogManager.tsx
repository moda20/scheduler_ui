import { useState, useCallback, useId, useContext } from "react"
import { useAppDispatch } from "@/app/hooks"
import { closeTopDialog, openDialog } from "@/app/reducers/uiReducer"
import { ReactReduxContext } from "react-redux"
import { useHotkeys } from "react-hotkeys-hook"
import type { Store } from "redux"
function useDialogueManager({ enableEscapeHotKey = false } = {}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const dispatch = useAppDispatch()
  const cptId = useId()
  const { store } = useContext(ReactReduxContext) as {
    store: Store
  }
  useHotkeys("esc", () => {
    if (enableEscapeHotKey) {
      setDialogState(false)
    }
  })
  const canClose = (dialog: string) => {
    const stack = store.getState().ui.dialogStack
    return stack.length > 0 && stack[stack.length - 1] === dialog
  }

  const updateDialogState = (
    open: boolean,
    callback?: (open: boolean) => void,
  ) => {
    if (open) {
      dispatch(openDialog(cptId))
      setIsDialogOpen(open)
      if (callback) {
        callback(open)
      }
    } else {
      if (canClose(cptId)) {
        setIsDialogOpen(open)
        dispatch(closeTopDialog())
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
    [updateDialogState, isDialogOpen],
  )

  return {
    setDialogState,
    isDialogOpen,
  }
}

export default useDialogueManager
