import { useAppSelector } from "@/app/hooks"
import { config } from "@/app/reducers/uiReducer"

export interface PublicBackendImageProps extends React.ComponentProps<"img"> {}

export default function BImage(props: PublicBackendImageProps) {
  const savedConfig = useAppSelector(config)
  const src = new URL(props.src || "", savedConfig.targetServer)
  return <img {...props} src={src.toString()} />
}
