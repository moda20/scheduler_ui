import { FormControl } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useDialogueManager from "@/hooks/useDialogManager"

export type ManagedSelectInputValue = {
  value: string
  label: string
}

export interface ManagedSelectProps {
  onChange: (value?: ManagedSelectInputValue) => void
  defaultValue?: string
  inputOptions: Array<ManagedSelectInputValue>
  inputPlaceholder?: string
}

export default function ManagedSelect(props: ManagedSelectProps) {
  const { isDialogOpen, setDialogState } = useDialogueManager()

  return (
    <Select
      open={isDialogOpen}
      onOpenChange={v => setDialogState(v)}
      onValueChange={v => {
        props.onChange(props.inputOptions.find(e => e?.value === v))
        setDialogState(false)
      }}
      defaultValue={props.defaultValue}
    >
      <SelectTrigger
        onClick={v => {
          v.preventDefault()
          setDialogState(true)
        }}
      >
        <SelectValue placeholder={props.inputPlaceholder} />
      </SelectTrigger>
      <SelectContent
        className="bg-background text-foreground"
        onEscapeKeyDown={v => {
          v.preventDefault()
          setDialogState(false)
        }}
      >
        {props.inputOptions.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
