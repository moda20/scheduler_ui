import {
  useState,
  useCallback,
  useId,
  useContext,
  useEffect,
  useRef,
} from "react"
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
function useDialogueManager({ enableEscapeHotKey = false, inputGroup } = {}) {
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
  useEffect(() => {
    if (
      inputGroup &&
      (currentStack.length === 0 || !currentStack.includes(cptId)) &&
      isDialogOpen
    ) {
      updateDialogState(false)
    }
  }, [currentStack])

  const canClose = (dialog: string, canBeDirectClosed: boolean = false) => {
    const stack = store.getState().ui.dialogStack
    return (
      stack.length > 0 &&
      (canBeDirectClosed || stack[stack.length - 1] === dialog)
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
    [updateDialogState, isDialogOpen, currentStack],
  )

  return {
    setDialogState,
    isDialogOpen,
  }
}

export default useDialogueManager
