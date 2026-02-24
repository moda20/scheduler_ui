// assisted by opencode & gemeni
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
import { LinkIcon } from "lucide-react"
import type { ComboBoxItem } from "@/components/ui/combo-box"
import { ComboBox } from "@/components/ui/combo-box"
import { cn } from "@/lib/utils"
import useDialogueManager from "@/hooks/useDialogManager"
import type { NotificationService } from "@/models/notifications"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ConfirmationDialogAction, {
  ConfirmationDialogActionType,
} from "@/components/confirmationDialogAction"
import { MinusIcon } from "@radix-ui/react-icons"
import BImage from "@/components/custom/general/PublicBackendImage"
import { Separator } from "@/components/ui/separator"

export interface NotificationLinkDialogProps {
  children: React.ReactNode
  notificationDetails?: NotificationService
  JobsList: ComboBoxItem[] | (() => Promise<ComboBoxItem[]>)
  onChange: (value: NotificationLinkUpdateType) => Promise<void> | void
  triggerClassName?: string
}

const NotificationUpdateSchema = z.object({
  id: z.union([z.number(), z.string()]),
  jobs: z.array(z.any()).optional(),
  name: z.string(),
})

export type NotificationLinkUpdateType = z.infer<
  typeof NotificationUpdateSchema
>

export function NotificationLinkDialog({
  children,
  notificationDetails,
  onChange,
  JobsList,
  triggerClassName,
}: NotificationLinkDialogProps) {
  const form = useForm<z.infer<typeof NotificationUpdateSchema>>({
    resolver: zodResolver(NotificationUpdateSchema),
    defaultValues: {
      id: notificationDetails?.id ?? "",
      jobs:
        notificationDetails?.jobs?.map((e: { job_id: any }) => e.job_id) ?? [],
      name: notificationDetails?.name ?? "",
    },
  })
  const { isDialogOpen, setDialogState } = useDialogueManager()
  return (
    <Dialog open={isDialogOpen} onOpenChange={v => setDialogState(v)}>
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
        className="sm:max-w-[425px] text-foreground bg-background"
        onEscapeKeyDown={e => {
          e.preventDefault()
          setDialogState(false)
        }}
      >
        <DialogHeader>
          <DialogTitle>Update Notification Service Links</DialogTitle>
          <DialogDescription>
            Link or Unlink the {notificationDetails?.name} to jobs
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              v => {
                v.id = notificationDetails?.id || ""
                v.name = notificationDetails?.name || ""
                onChange(v)
              },
              err => {
                console.log(err)
              },
            )}
            className="space-y-6"
          >
            <Card className="border-transparent border-0">
              <CardContent className="p-0 pt-0 flex gap-5 ">
                <BImage
                  src={notificationDetails?.image}
                  alt={notificationDetails?.name}
                  className="w-3/12 rounded-md overflow-hidden break-all"
                />
                <div className="flex flex-col gap-2 w-7/12">
                  <h2 className="w-full mt-10 scroll-m-20 font-semibold tracking-tight transition-colors first:mt-0">
                    {notificationDetails?.name}
                  </h2>
                  <p className="w-full transition-colors font-mono text-sm">
                    {notificationDetails?.description}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Separator orientation="horizontal" className="mr-2 h-1" />
            <Card className="border-transparent">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-2 text-foreground bg-background border-transparent rounded-t-xl">
                <CardTitle className="text-lg font-bold">Jobs</CardTitle>
                <ConfirmationDialogAction
                  title={"Detach all jobs"}
                  description={"Detach all jobs from this notification service"}
                  takeAction={action => {
                    if (action === ConfirmationDialogActionType.CANCEL) return
                    form.setValue("jobs", [], {
                      shouldTouch: true,
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }}
                  confirmText={"Detach all jobs"}
                >
                  <Button
                    variant={"destructive"}
                    size="sm"
                    className="btn-rounded"
                  >
                    <MinusIcon />
                    Detach all
                  </Button>
                </ConfirmationDialogAction>
              </CardHeader>
              <CardContent className="p-0 pt-0 flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="jobs"
                  render={({ field }) => (
                    <div>
                      <FormItem>
                        <FormLabel>
                          Select the jobs that can use this notification service
                        </FormLabel>
                        <br />
                        <FormControl ref={field.ref}>
                          <ComboBox
                            selectedItemValue={field.value}
                            itemList={JobsList}
                            {...field}
                            noFieldsFoundText={"No Jobs found"}
                            searchFieldPlaceholder={"Search registered Jobs..."}
                            inputFieldsText={"Select job to link to..."}
                            className="w-[--radix-popover-trigger-width]"
                            triggerClassName={"w-full"}
                            multiSelect={true}
                            managed={true}
                            maxSelectedItemsToShowOnMainTrigger={3}
                          />
                        </FormControl>
                        <FormDescription>
                          The selected job will have the notification service
                          injected to it and used for notifications
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />
              </CardContent>
            </Card>
            <DialogFooter>
              <Button variant={"default"} type="submit">
                <LinkIcon />
                Update notification links
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
