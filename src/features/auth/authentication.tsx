import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

import useDialogueManager from "@/hooks/useDialogManager"
import { LoginForm } from "@/components/login-form"
import authService from "@/services/authService"
import { useCallback, useEffect, useState } from "react"
import {
  ConnectionStatus,
  connectionStatus,
  setUser,
} from "@/app/reducers/authReducer"
import type { LoginFormData, RegisterFormData } from "@/models/auth"

export interface AuthenticationProps extends React.ComponentProps<"div"> {}

export default function Authentication({
  children,
  ...props
}: AuthenticationProps) {
  const dispatch = useAppDispatch()
  const { isDialogOpen, setDialogState } = useDialogueManager()
  const [authChecking, setAuthChecking] = useState(false)
  const targetConnectionStatus = useAppSelector(connectionStatus)

  const isConnected = targetConnectionStatus === ConnectionStatus.CONNECTED
  const connectionInProgress =
    targetConnectionStatus === ConnectionStatus.INPROGRESS

  const checkLoginData = useCallback(async () => {
    const data = await authService.me()
    dispatch(setUser(data as LoginFormData))
  }, [dispatch])

  useEffect(() => {
    if (isConnected) {
      setDialogState(false)
    } else {
      if (!connectionInProgress) {
        setDialogState(true)
      }
    }
  }, [isConnected, targetConnectionStatus])

  const loginAction = useCallback(
    async (data: LoginFormData) => {
      console.log(data)
      await authService.login(data)
      dispatch(setUser(data))
    },
    [dispatch],
  )

  const registerAction = useCallback(
    async (data: RegisterFormData) => {
      console.log(data)
      await authService.register(data)
      dispatch(setUser(data))
    },
    [dispatch],
  )

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => {}}>
      <DialogTrigger
        className=""
        onClick={v => {
          v.preventDefault()
          setDialogState(true)
        }}
        asChild
      >
        {children}
      </DialogTrigger>
      <DialogContent
        hideCloseButton={true}
        className="sm:max-w-[50%] xxl:max-w-[40%] text-foreground bg-background border-border rounded-t-xl"
      >
        <LoginForm
          onLoginSubmit={v => loginAction(v)}
          onRegisterSubmit={v => registerAction(v)}
        />
      </DialogContent>
    </Dialog>
  )
}
