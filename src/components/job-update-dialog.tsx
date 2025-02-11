import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { jobsTableData } from "@/features/jobsTable/interfaces"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Cron from "react-js-cron"
import { PlusIcon, SaveIcon } from "lucide-react"
import type { ComboBoxItem } from "@/components/ui/combo-box"
import { ComboBox } from "@/components/ui/combo-box"
import { cn, parseCron } from "@/lib/utils"
import useDialogueManager from "@/hooks/useDialogManager"
import { useHotkeys } from "react-hotkeys-hook"

export interface JobUpdateDialogProps {
  children: React.ReactNode
  isCreateDialog?: boolean
  jobDetails?: jobsTableData
  itemList: ComboBoxItem[] | (() => Promise<ComboBoxItem[]>)
  onChange: (value: z.infer<typeof jobUpdateSchema>) => void
  triggerClassName?: string
}
export type JobUpdateType = z.infer<typeof jobUpdateSchema>

const jobUpdateSchema = z.object({
  cronSetting: z.string(),
  name: z.string(),
  consumer: z.string(),
  param: z.string().nullish(),
})

export function JobUpdateDialog({
  children,
  isCreateDialog,
  jobDetails,
  onChange,
  itemList,
  triggerClassName,
}: JobUpdateDialogProps) {
  const form = useForm<z.infer<typeof jobUpdateSchema>>({
    resolver: zodResolver(jobUpdateSchema),
    defaultValues: {
      name: jobDetails?.name,
      consumer: jobDetails?.consumer,
      cronSetting: jobDetails?.cronSetting,
      param: jobDetails?.param,
    },
  })
  const { isDialogOpen, setDialogState } = useDialogueManager()

  useHotkeys(["ctrl+alt+n", "meta+alt+n"], () => {
    setDialogState(true)
  })

  return (
    <Dialog open={isDialogOpen} onOpenChange={v => setDialogState(v)}>
      <DialogTrigger
        className={cn(triggerClassName)}
        onClick={v => {
          v.preventDefault()
          setDialogState(true)
        }}
      >
        {children}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] text-foreground bg-background"
        onEscapeKeyDown={e => {
          e.preventDefault()
          setDialogState(false)
        }}
      >
        <DialogHeader>
          <DialogTitle>{isCreateDialog ? "Create" : "Edit"} Job</DialogTitle>
          <DialogDescription>
            {isCreateDialog
              ? "Create a new job here. Click save when you're done."
              : `Edit the ${jobDetails?.name} job`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              v => {
                onChange(v)
                if (isCreateDialog) {
                  setDialogState(false)
                }
              },
              err => {
                console.log(err)
              },
            )}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="cronSetting"
              render={({ field }) => (
                <div>
                  <FormItem>
                    <FormLabel>Cron setting</FormLabel>
                    <FormControl>
                      <Input placeholder="0 7 * * *" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the cron settings for the job :{" "}
                      {parseCron(field.value)}.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                  <Cron
                    value={field.value ?? ""}
                    setValue={(newValue: string) => {
                      field.onChange(newValue)
                    }}
                  />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <div>
                  <FormItem>
                    <FormLabel>job name</FormLabel>
                    <FormControl>
                      <Input placeholder="a unique name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the job name, it should be a unique name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="consumer"
              render={({ field }) => (
                <div>
                  <FormItem>
                    <FormLabel>Consumer script</FormLabel>
                    <br />
                    <FormControl ref={field.ref}>
                      <ComboBox
                        selectedItemValue={jobDetails?.consumer}
                        itemList={itemList}
                        {...field}
                        noFieldsFoundText={"No consumer scripts found"}
                        searchFieldPlaceholder={"Search consumer scripts..."}
                        inputFieldsText={"Select consumer script..."}
                        className="w-[--radix-popover-trigger-width]"
                        triggerClassName={"w-full"}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the consumer script that will be run when the job
                      is triggered
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <DialogFooter>
              <Button variant={"default"} type="submit">
                {isCreateDialog ? <PlusIcon /> : <SaveIcon />}
                {isCreateDialog ? "Add a new job" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
