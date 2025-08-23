import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import useDialogueManager from "@/hooks/useDialogManager"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Search } from "lucide-react"
import { format } from "date-fns"
import { DatePickerWithPresets } from "@/components/ui/date-picker-presets"
import type { InputType } from "@/components/custom/general/MultiTypedInput"
import { defaultMultiTypeNullValue } from "@/components/custom/general/MultiTypedInput"
import { FlexibleInput } from "@/components/custom/general/MultiTypedInput"
import { forwardRef, useCallback, useImperativeHandle } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { proxyProtocolOptions } from "@/models/proxies"
import ManagedSelect from "@/components/custom/ManagedSelect"

export interface AdvancedJobFilteringDialogProps {
  children: React.ReactNode
  triggerClassName?: string
  onSubmit?: (value: any) => void
}

const jobFilteringSchema = z.object({
  name: z.object({ value: z.string(), type: z.string() }).optional(),
  cronSetting: z.object({ value: z.string(), type: z.string() }).optional(),
  consumer: z.object({ value: z.string(), type: z.string() }).optional(),
  status: z.string().optional(),
  isRunning: z.boolean().optional(),
  averageTime: z
    .object({
      value1: z.coerce.number(),
      value2: z.coerce.number(),
      type: z.string(),
    })
    .optional(),
  latestRun: z
    .object({
      from: z.union([z.date(), z.literal(undefined)]),
      to: z.union([z.date(), z.literal(undefined)]).optional(),
    })
    .optional(),
})

export type jobFilteringSchemaType = z.infer<typeof jobFilteringSchema>

const statusOptions = [
  {
    label: "Stopped",
    value: "STOPPED",
  },
  {
    label: "Started",
    value: "STARTED",
  },
  {
    label: "All",
    value: undefined,
  },
]
const runningStatusOptions = [
  {
    label: "Running",
    value: true,
  },
  {
    label: "Not running",
    value: false,
  },
  {
    label: "All",
    value: undefined,
  },
]

export type AdvancedJobFilteringDialogHandle = {
  reset: () => void
}

const textOnlyInputTypes: InputType[] = ["exact", "regex"]

export const AdvancedJobFilteringDialog = forwardRef<
  AdvancedJobFilteringDialogHandle,
  AdvancedJobFilteringDialogProps
>(({ triggerClassName, children, onSubmit }, ref) => {
  const { isDialogOpen, setDialogState } = useDialogueManager()
  useImperativeHandle(ref, () => ({
    reset: () => {
      form.reset()
    },
  }))

  const form = useForm<jobFilteringSchemaType>({
    resolver: zodResolver(jobFilteringSchema),
    defaultValues: {
      name: undefined,
      cronSetting: undefined,
      consumer: undefined,
      status: undefined,
      isRunning: undefined,
      averageTime: undefined,
      latestRun: undefined,
    },
  })

  function submitForm(values: jobFilteringSchemaType) {
    setDialogState(false)
    onSubmit?.({
      ...values,
      status: values.status ? [values.status] : ["STOPPED", "STARTED"],
      latestRun: values.latestRun
        ? {
            type: "between",
            value1: values.latestRun.from,
            value2: values.latestRun.to,
          }
        : undefined,
    })
  }

  const errorHandler = useCallback(
    (field: any, err?: string) => {
      if (err) {
        form.setError(field.name, { message: err })
      } else {
        form.clearErrors(field.name)
      }
    },
    [form],
  )

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={v => {
        setDialogState(v)
      }}
    >
      <DialogTrigger
        className={cn(triggerClassName)}
        onClick={v => {
          v.preventDefault()
          setDialogState(true)
        }}
        asChild
      >
        {children}
      </DialogTrigger>
      <DialogContent
        className={cn("sm:max-w-[425px] text-foreground bg-background")}
        onEscapeKeyDown={e => {
          e.preventDefault()
          setDialogState(false)
        }}
      >
        <DialogHeader>
          <DialogTitle>Advanced Task execution</DialogTitle>
          <DialogDescription>
            Filter and execute tasks in batches
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitForm)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <FlexibleInput
                      placeholder="Job name"
                      {...field}
                      onError={errorHandler}
                      acceptedInputTypes={textOnlyInputTypes}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cronSetting"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cron Setting</FormLabel>
                  <FormControl>
                    <FlexibleInput
                      placeholder="Cron setting"
                      {...field}
                      onError={errorHandler}
                      acceptedInputTypes={textOnlyInputTypes}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="consumer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consumer</FormLabel>
                  <FormControl>
                    <FlexibleInput
                      placeholder="Consumer"
                      {...field}
                      onError={errorHandler}
                      acceptedInputTypes={textOnlyInputTypes}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 justify-evenly w-full">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Status</FormLabel>
                    <ManagedSelect
                      onChange={field.onChange}
                      inputOptions={statusOptions}
                      defaultValue={field.value}
                      exportOnlyValue={true}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isRunning"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Is Running</FormLabel>
                    <FormControl>
                      <div className="flex flex-col space-y-2">
                        <ManagedSelect
                          onChange={field.onChange}
                          inputOptions={runningStatusOptions}
                          defaultValue={field.value}
                          exportOnlyValue={true}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="averageTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Average Time (sec)</FormLabel>
                  <FormControl>
                    <FlexibleInput
                      placeholder="Average time"
                      {...field}
                      onError={errorHandler}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="latestRun"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Last Run Date Range</FormLabel>
                  <FormControl>
                    <DatePickerWithPresets onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 items-center justify-evenly w-full">
              <Button variant="ghost" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit" className="w-full">
                <Search className="mr-2 h-4 w-4" /> Apply Filters
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})
