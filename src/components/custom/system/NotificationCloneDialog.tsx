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
import type { NotificationService } from "@/models/notifications"
import { z } from "zod/v4"
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
import { CopyIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import useDialogueManager from "@/hooks/useDialogManager"
import BImage from "@/components/custom/general/PublicBackendImage"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import Spinner from "@/components/custom/LoadingOverlay"

export interface NotificationCloneDialogProps {
  children: React.ReactNode
  notificationServiceDetails: NotificationService
  onChange: (serviceId: number, name: string) => Promise<void>
  triggerClassName?: string
}

const cloneServiceSchema = z.object({
  name: z
    .string({
      error: "Name is required",
    })
    .min(1, "Name is required"),
})

export function NotificationCloneDialog({
  children,
  notificationServiceDetails,
  onChange,
  triggerClassName,
}: NotificationCloneDialogProps) {
  const form = useForm<z.infer<typeof cloneServiceSchema>>({
    resolver: zodResolver(cloneServiceSchema),
  })
  const { isDialogOpen, setDialogState } = useDialogueManager()
  const [isLoading, setIsLoading] = useState(false)

  const resetState = (finalState: boolean) => {
    if (!finalState) {
      form.reset()
    }
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={v => {
        setDialogState(v, resetState)
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
        className="sm:max-w-[500px] text-foreground bg-background"
        onEscapeKeyDown={e => {
          e.preventDefault()
          setDialogState(false, resetState)
        }}
      >
        <DialogHeader>
          <DialogTitle>Clone Notification Service</DialogTitle>
          <DialogDescription>
            You are cloning the "{notificationServiceDetails.name}" service.
          </DialogDescription>
        </DialogHeader>
        <Spinner isLoading={isLoading}>
          <div className="flex flex-col gap-4 p-2">
            <div className="flex gap-4 p-4">
              <BImage
                src={notificationServiceDetails.image}
                alt={notificationServiceDetails.name}
                className="w-16 h-16 rounded-md flex-shrink-0"
              />
              <div className="flex flex-col gap-2 min-w-0">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-semibold">Name</Label>
                  <div className="text-sm font-medium truncate whitespace-normal">
                    {notificationServiceDetails.name}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-semibold">Description</Label>
                  <p className="text-sm text-muted-foreground truncate whitespace-normal">
                    {notificationServiceDetails.description}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-semibold">Entrypoint</Label>
                  <div className="text-sm text-muted-foreground truncate whitespace-normal">
                    {notificationServiceDetails.entryPoint}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="mr-2 h-1" />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(async values => {
                  try {
                    setIsLoading(true)
                    await onChange(
                      Number(notificationServiceDetails.id),
                      values.name,
                    )
                    setIsLoading(false)
                    setDialogState(false, resetState)
                  } catch (error) {}
                })}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clone Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`${notificationServiceDetails.name} (clone)`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        This will be the name of the cloned service.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    <CopyIcon className="mr-2 h-4 w-4" />
                    Clone Service
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </Spinner>
      </DialogContent>
    </Dialog>
  )
}
