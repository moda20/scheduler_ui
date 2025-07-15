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
import { PlusIcon, SaveIcon, Trash2Icon } from "lucide-react"
import type { ComboBoxItem } from "@/components/ui/combo-box"
import { ComboBox } from "@/components/ui/combo-box"
import { cn } from "@/lib/utils"
import useDialogueManager from "@/hooks/useDialogManager"
import type { NotificationService } from "@/models/notifications"
import ImageDropInComponent from "@/components/custom/general/ImageDropInComponent"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useCallback } from "react"
import ConfirmationDialogAction, {
  ConfirmationDialogActionType,
} from "@/components/confirmationDialogAction"

export interface NotificationConfigDialogProps {
  children: React.ReactNode
  isCreateDialog?: boolean
  notificationServiceDetails?: NotificationService
  JobsList: ComboBoxItem[] | (() => Promise<ComboBoxItem[]>)
  serviceFileList: ComboBoxItem[] | (() => Promise<ComboBoxItem[]>)
  onChange: (value: FormData) => void
  onDeletion?: (serviceId: number) => void
  triggerClassName?: string
}

const NotificationUpdateSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string(),
  description: z.string().optional(),
  entryPoint: z.string(),
  image: z.any().optional(),
  jobs: z.array(z.string()).optional(),
})

export type NotificationConfigUpdateType = z.infer<
  typeof NotificationUpdateSchema
>

export function NotificationConfigDialog({
  children,
  isCreateDialog,
  notificationServiceDetails,
  serviceFileList,
  JobsList,
  onChange,
  onDeletion,
  triggerClassName,
}: NotificationConfigDialogProps) {
  const form = useForm<z.infer<typeof NotificationUpdateSchema>>({
    resolver: zodResolver(NotificationUpdateSchema),
    values: {
      name: notificationServiceDetails?.name ?? "",
      description: notificationServiceDetails?.description ?? "",
      entryPoint: notificationServiceDetails?.entryPoint || "",
      image: notificationServiceDetails?.image && {
        url: notificationServiceDetails?.image,
        fileName: notificationServiceDetails?.image,
      },
      jobs: notificationServiceDetails?.jobs?.map(toString),
    },
    resetOptions: {
      keepValues: false,
      keepDefaultValues: false,
    },
  })
  const { isDialogOpen, setDialogState } = useDialogueManager()

  const submitFormData = useCallback(
    (inputData: NotificationConfigUpdateType) => {
      const formData = new FormData()
      if (notificationServiceDetails?.id) {
        formData.append("id", notificationServiceDetails.id?.toString())
      }
      if (inputData.image?.image) {
        formData.append("image", inputData.image?.image)
        formData.append("imageName", inputData.image?.fileName)
      }
      formData.append("name", inputData.name)
      formData.append("description", inputData.description ?? "")
      formData.append("entryPoint", inputData.entryPoint)
      formData.append("jobs", inputData.jobs?.toString() ?? "[]")
      return formData
    },
    [isDialogOpen],
  )

  const dialogChange = useCallback(
    (e: boolean) => {
      if (!e) {
        form.reset()
      }
      setDialogState(e)
    },
    [isDialogOpen, setDialogState, form],
  )

  const deleteService = useCallback(
    (action: ConfirmationDialogActionType) => {
      if (action === ConfirmationDialogActionType.CANCEL || !onDeletion) return
      dialogChange(false)
      setTimeout(() => {
        onDeletion(Number(notificationServiceDetails?.id))
      }, 150)
    },
    [notificationServiceDetails, onDeletion],
  )

  return (
    <Dialog open={isDialogOpen} onOpenChange={dialogChange}>
      <DialogTrigger
        asChild
        className={cn(triggerClassName)}
        onClick={v => {
          v.preventDefault()
          dialogChange(true)
        }}
      >
        {children}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[480px] text-foreground bg-background"
        onEscapeKeyDown={e => {
          e.preventDefault()
          dialogChange(false)
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {isCreateDialog ? "Add" : "Edit"} Notification service
          </DialogTitle>
          <DialogDescription>
            {isCreateDialog
              ? "Add a Notification service"
              : `Edit the ${notificationServiceDetails?.name} service`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              v => {
                onChange(submitFormData(v))
                setDialogState(false)
              },
              err => {
                console.log(err)
              },
            )}
            className="space-y-8"
          >
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service image</FormLabel>
                    <FormControl>
                      <ImageDropInComponent
                        className="w-[200px] h-[220px]"
                        {...field}
                        image={field.value}
                        type={"file"}
                        onfileUpload={v => {
                          field.onChange(v)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-4 w-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service name*</FormLabel>
                      <div>{field.value}</div>
                      <FormControl>
                        <Input
                          placeholder="input the name of ther service*"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="input a description of the service"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator orientation="horizontal" className="mr-2 h-1" />
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="entryPoint"
                render={({ field }) => (
                  <div>
                    <FormItem>
                      <FormLabel>Entrypoint script</FormLabel>
                      <br />
                      <FormControl ref={field.ref}>
                        <ComboBox
                          selectedItemValue={
                            notificationServiceDetails?.entryPoint
                          }
                          itemList={serviceFileList}
                          {...field}
                          noFieldsFoundText={"No services found"}
                          searchFieldPlaceholder={"Search services..."}
                          inputFieldsText={"Select service entrypoint"}
                          className="w-[--radix-popover-trigger-width]"
                          triggerClassName={"w-full"}
                        />
                      </FormControl>
                      <FormDescription>
                        This is the notification service entrypoint that will be
                        used to instantiate the service when running the job
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
            </div>
            <Separator orientation="horizontal" className="mr-2 h-1" />
            <FormField
              control={form.control}
              name="jobs"
              render={({ field }) => (
                <div>
                  <FormItem>
                    <FormLabel>Attached Jobs</FormLabel>
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
            <DialogFooter className="flex items-center sm:justify-between">
              {!isCreateDialog && onDeletion && (
                <ConfirmationDialogAction
                  title={`Confirm deleting ${notificationServiceDetails?.name}`}
                  description={
                    "Delete this service, this will also unlink it from all newer job executions, running jobs will not be afected"
                  }
                  takeAction={deleteService}
                  confirmText={"Delete service"}
                  confirmVariant={"destructive"}
                  cancelText={"Cancel"}
                >
                  <Button variant="destructive" type="button">
                    <Trash2Icon /> Delete service
                  </Button>
                </ConfirmationDialogAction>
              )}
              <Button variant={"default"} type="submit">
                {isCreateDialog ? <PlusIcon /> : <SaveIcon />}
                {isCreateDialog ? "Add a new Proxy" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
