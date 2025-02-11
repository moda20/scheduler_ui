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
import { LinkIcon, PlusIcon, SaveIcon } from "lucide-react"
import type { ComboBoxItem } from "@/components/ui/combo-box"
import { ComboBox } from "@/components/ui/combo-box"
import { cn, parseCron } from "@/lib/utils"
import useDialogueManager from "@/hooks/useDialogManager"
import { useHotkeys } from "react-hotkeys-hook"
import type { ProxyTableData } from "@/models/proxies"
import { proxyProtocolOptions, ProxyStatus } from "@/models/proxies"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PasswordInput } from "@/components/ui/password-input"
import ManagedSelect from "@/components/custom/ManagedSelect"

export interface ProxyLinkDialogProps {
  children: React.ReactNode
  proxyDetails?: ProxyTableData
  JobsList: ComboBoxItem[] | (() => Promise<ComboBoxItem[]>)
  onChange: (value: ProxyLinkUpdateType) => void
  triggerClassName?: string
}

const ProxyUpdateSchema = z.object({
  id: z.union([z.number(), z.string()]),
  jobs: z.array(z.any()).optional(),
  proxy_ip: z.string(),
  proxy_port: z.union([z.number(), z.string()]),
})

export type ProxyLinkUpdateType = z.infer<typeof ProxyUpdateSchema>

export function ProxyLinkDialog({
  children,
  proxyDetails,
  onChange,
  JobsList,
  triggerClassName,
}: ProxyLinkDialogProps) {
  const form = useForm<z.infer<typeof ProxyUpdateSchema>>({
    resolver: zodResolver(ProxyUpdateSchema),
    defaultValues: {
      id: proxyDetails?.id ?? "",
      jobs: proxyDetails?.job?.map(e => e.job_id) ?? [],
      proxy_ip: proxyDetails?.proxy_ip ?? "",
      proxy_port: proxyDetails?.proxy_port ?? "",
    },
  })
  const { isDialogOpen, setDialogState } = useDialogueManager()
  console.log(proxyDetails)
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
          <DialogTitle>Update proxy Links</DialogTitle>
          <DialogDescription>
            Link or Unlink the {proxyDetails?.proxy_ip}:
            {proxyDetails?.proxy_port} to jobs
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              v => {
                onChange(v)
              },
              err => {
                console.log(err)
              },
            )}
            className="space-y-8"
          >
            <div>
              <Card className="border-transparent">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-2 text-foreground bg-background border-transparent rounded-t-xl">
                  <CardTitle className="text-lg font-bold">Proxy</CardTitle>
                </CardHeader>
                <CardContent className="p-0 pt-0 flex flex-col gap-2">
                  <div className={"flex gap-2"}>
                    <h2 className="w-2/6 mt-10 scroll-m-20 font-semibold tracking-tight transition-colors first:mt-0">
                      Config
                    </h2>
                    <p className="w-4/6 transition-colors font-mono text-sm">
                      {proxyDetails?.proxy_ip}:{proxyDetails?.proxy_port}
                    </p>
                  </div>
                  <div className={"flex gap-2"}>
                    <h2 className="w-2/6 mt-10 scroll-m-20 font-semibold tracking-tight transition-colors first:mt-0">
                      Description
                    </h2>
                    <p className="w-4/6 transition-colors font-mono text-sm">
                      {proxyDetails?.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className={"border-b"}></div>
            <div>
              <Card className="border-transparent">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-2 text-foreground bg-background border-transparent rounded-t-xl">
                  <CardTitle className="text-lg font-bold">Jobs</CardTitle>
                </CardHeader>
                <CardContent className="p-0 pt-0 flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="jobs"
                    render={({ field }) => (
                      <div>
                        <FormItem>
                          <FormLabel>
                            Select the jobs that can use this proxy
                          </FormLabel>
                          <br />
                          <FormControl ref={field.ref}>
                            <ComboBox
                              selectedItemValue={proxyDetails?.job?.map(
                                e => `${e.job_id}`,
                              )}
                              itemList={JobsList}
                              {...field}
                              noFieldsFoundText={"No Jobs found"}
                              searchFieldPlaceholder={
                                "Search registered Jobs..."
                              }
                              inputFieldsText={"Select job to link to..."}
                              className="w-[--radix-popover-trigger-width]"
                              triggerClassName={"w-full"}
                              multiSelect={true}
                            />
                          </FormControl>
                          <FormDescription>
                            The selected job will have the proxy injected to it
                            and used for network communications
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      </div>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            <DialogFooter>
              <Button variant={"default"} type="submit">
                <LinkIcon />
                Update proxy links
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
