import { useAppSelector } from "@/app/hooks"
import { config } from "@/app/reducers/uiReducer"
import { cn } from "@/lib/utils"

export interface PublicBackendImageProps extends React.ComponentProps<"img"> {}

export default function BImage({
  className,
  ...props
}: PublicBackendImageProps) {
  const savedConfig = useAppSelector(config)
  const src = new URL(props.src || "", savedConfig.targetServer)
  return (
    <img
      className={cn(className, "object-contain")}
      title={props.alt}
      {...props}
      src={src.toString()}
    />
  )
}
