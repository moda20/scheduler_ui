import { ReactNode } from "react"

interface withErrorProps {
  children: ReactNode
  errorCpt: string | ReactNode
  hasError: boolean
}
export default function WithError({
  children,
  errorCpt,
  hasError,
}: withErrorProps) {
  return hasError ? (
    <span className="text-destructive">{errorCpt}</span>
  ) : (
    children
  )
}
