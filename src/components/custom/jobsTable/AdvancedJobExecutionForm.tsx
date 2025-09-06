import { forwardRef, useImperativeHandle } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { jobFilteringSchemaType } from "@/components/custom/jobsTable/advancedJobFilteringDialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { FlexibleInput } from "@/components/custom/general/MultiTypedInput"
import ManagedSelect from "@/components/custom/ManagedSelect"
import { DatePickerWithPresets } from "@/components/ui/date-picker-presets"
import { Button } from "@/components/ui/button"
import { ListChecks, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ProxyStatus } from "@/models/proxies"
import { cn } from "@/lib/utils"

export interface AdvancedJobExecutionFormProps {
  onSubmit: (value: advancedJobExecutionFormSchemaType) => void
  className?: string
  disabled?: boolean
}

export interface AdvancedJobExecutionFormHandle {
  reset: () => void
}

const advancedJobExecutionFormSchema = z.object({
  batchCount: z.coerce.number().optional().default(1),
  batchDelay: z.coerce.number().optional().default(0),
  waitBetweenBatches: z.boolean().optional().default(false),
  executionOrderAttribute: z.string().optional().default("id"),
})

export type advancedJobExecutionFormSchemaType = z.infer<
  typeof advancedJobExecutionFormSchema
>

export const defaultBatchOrderingItems = [
  {
    label: "Id",
    value: "id",
  },
  {
    label: "Cron Setting",
    value: "cronSetting",
  },
  {
    label: "Name",
    value: "name",
  },
]
export const AdvancedJobExecutionForm = forwardRef<
  AdvancedJobExecutionFormHandle,
  AdvancedJobExecutionFormProps
>(({ onSubmit, className, disabled }, ref) => {
  useImperativeHandle(ref, () => ({
    reset: () => {
      form.reset()
    },
  }))

  const form = useForm<advancedJobExecutionFormSchemaType>({
    resolver: zodResolver(advancedJobExecutionFormSchema),
    defaultValues: {
      executionOrderAttribute: "id",
      batchCount: 1,
      batchDelay: 0,
      waitBetweenBatches: false,
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6 py-4", className)}
      >
        <div className="flex gap-2 w-full">
          <FormField
            control={form.control}
            name="batchCount"
            render={({ field }) => (
              <FormItem className="w-6/12">
                <FormLabel>Jobs per Batch</FormLabel>
                <FormControl>
                  <Input
                    placeholder="jobs per batch"
                    {...field}
                    type="number"
                  />
                </FormControl>
                <FormDescription>
                  The number of jobs to run together in a batch (will be
                  executed in parallel)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="batchDelay"
            render={({ field }) => (
              <FormItem className="w-6/12">
                <FormLabel>Delay between batches (ms)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="delay between batch (ms)"
                    {...field}
                    type="number"
                  />
                </FormControl>
                <FormDescription>
                  The delay between subsequent batch execution
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 w-full">
          <FormField
            control={form.control}
            name="waitBetweenBatches"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border-transparent  py-2 shadow w-6/12">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Wait between batches ?</FormLabel>
                  <FormDescription>
                    Wait until all jobs in a batch are completed before starting
                    the next one (counting the delay)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="executionOrderAttribute"
            render={({ field }) => (
              <FormItem className="w-6/12">
                <FormLabel>Jobs Order basis</FormLabel>
                <FormControl>
                  <ManagedSelect
                    onChange={field.onChange}
                    inputOptions={defaultBatchOrderingItems}
                    defaultValue={field.value}
                  />
                </FormControl>
                <FormDescription>
                  The attribute to use to order jobs into batches
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2 items-center justify-evenly w-full mt-auto">
          <Button type="button" variant="ghost" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" className="w-full" disabled={disabled}>
            <ListChecks className="mr-2 h-4 w-4" />{" "}
            {disabled ? "Filter preview required" : "Execute"}
          </Button>
        </div>
      </form>
    </Form>
  )
})
