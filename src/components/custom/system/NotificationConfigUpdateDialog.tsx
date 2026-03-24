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
import { LoaderPinwheelIcon, SaveIcon } from "lucide-react"
import useDialogueManager from "@/hooks/useDialogManager"
import { cn } from "@/lib/utils"
import { notificationService } from "@/services/notificationsService"
import { useState, useEffect, useCallback } from "react"
import Spinner from "@/components/custom/LoadingOverlay"
import { CrossCircledIcon } from "@radix-ui/react-icons"

export interface NotificationConfigUpdateDialogProps {
  children: React.ReactNode
  serviceName?: string
  onChange: (formValues: any) => Promise<void>
  triggerClassName?: string
}

const ConfigSchema = z.record(z.string(), z.string().optional().default(""))

export type ConfigUpdateType = z.infer<typeof ConfigSchema>

export function NotificationConfigUpdateDialog({
  children,
  serviceName,
  onChange,
  triggerClassName,
}: NotificationConfigUpdateDialogProps) {
  const { isDialogOpen, setDialogState } = useDialogueManager()
  const [isLoading, setIsLoading] = useState(false)
  const [configData, setConfigData] = useState<Record<
    string,
    { value: string; is_encrypted: boolean }
  > | null>(null)
  const [defaultValues, setDefaultValues] = useState<Record<string, string>>({})

  const form = useForm<z.infer<typeof ConfigSchema>>({
    resolver: zodResolver(ConfigSchema),
    defaultValues: {},
  })

  const resetState = (finalState: boolean) => {
    if (!finalState) {
      form.reset()
      setConfigData(null)
    }
  }

  const fetchConfig = useCallback(
    async (name: string) => {
      setIsLoading(true)
      try {
        const data =
          await notificationService.getNotificationServiceConfigurations(name)
        const notifications = data.notifications || {}
        const serviceConfig = notifications[name] || {}

        setConfigData(serviceConfig)

        const defaultValues = Object.entries(serviceConfig).reduce(
          (acc, [key, val]) => {
            const fieldConfig = val as { value: string; is_encrypted: boolean }
            return {
              ...acc,
              [key]: fieldConfig.value,
            }
          },
          {},
        )
        setDefaultValues(defaultValues)
        form.reset(defaultValues)
      } catch (error) {
        console.error("Failed to fetch config:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [serviceName, form],
  )

  useEffect(() => {
    if (isDialogOpen && serviceName) {
      fetchConfig(serviceName)
    }
  }, [isDialogOpen, fetchConfig, serviceName])

  const submitFormData = useCallback(
    (inputData: ConfigUpdateType) => {
      return Object.entries(inputData)
        .filter(([key, value]) => value !== defaultValues[key])
        .reduce(
          (p, [key, value]) => {
            p[key] = {
              value,
            }
            return p
          },
          {} as { [key: string]: any },
        )
    },
    [defaultValues],
  )

  const submitConfigUpdate = useCallback(
    async (inputData: any) => {
      setIsLoading(true)
      try {
        await onChange(submitFormData(inputData))
      } catch (error) {
        console.error("Failed to update config:", error)
      } finally {
        setIsLoading(false)
        setDialogState(false)
      }
    },
    [onChange, submitFormData, setDialogState],
  )

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={v => setDialogState(v, resetState)}
    >
      <DialogTrigger
        asChild
        className={cn(triggerClassName)}
        onClick={v => {
          v.preventDefault()
          setDialogState(true)
        }}
      >
        {children}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[480px] text-foreground bg-background"
        onEscapeKeyDown={e => {
          e.preventDefault()
          setDialogState(false, resetState)
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit {serviceName} Configuration</DialogTitle>
          <DialogDescription>
            Update the config for the {serviceName} notification service
          </DialogDescription>
        </DialogHeader>

        <Spinner
          isLoading={isLoading}
          icon={LoaderPinwheelIcon}
          className="h-full w-full"
        >
          {configData && !Object.entries(configData!)?.length ? (
            <div className="flex flex-col gap-2 items-center justify-center p-2 w-full">
              <CrossCircledIcon className="w-6 h-6 text-muted-foreground" />
              <div className="text-muted-foreground text-sm">
                No configuration found for this service
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(submitConfigUpdate, err => {
                  console.log(err)
                })}
                className="space-y-4 w-full"
              >
                {configData &&
                  Object.entries(configData).map(([key, fieldData]) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={key}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {key}
                            {fieldData.is_encrypted && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                (encrypted)
                              </span>
                            )}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="focus-visible:ring-0 focus-visible:border-gray-400"
                              type={
                                fieldData.is_encrypted ? "password" : "text"
                              }
                              placeholder={
                                fieldData.is_encrypted
                                  ? "**********************"
                                  : `Enter ${key}`
                              }
                            />
                          </FormControl>
                          {fieldData.is_encrypted && (
                            <FormDescription>
                              Leave empty to keep the current encrypted value
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                <DialogFooter>
                  <Button
                    variant={"default"}
                    type="submit"
                    disabled={isLoading}
                  >
                    <SaveIcon />
                    Save changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </Spinner>
      </DialogContent>
    </Dialog>
  )
}
