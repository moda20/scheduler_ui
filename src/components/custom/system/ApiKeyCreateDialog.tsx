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
import { AlertCircle, Check, Copy } from "lucide-react"
import useDialogueManager from "@/hooks/useDialogManager"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

export interface ApiKeyCreateDialogProps {
  children: React.ReactNode
  onChange: (name: string) => Promise<string | undefined>
}

const ApiKeyCreateSchema = z.object({
  name: z.string().min(1, "Key name is required"),
})

const KeyWarningComponent = ({ inputKey }: { inputKey: string }) => {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(inputKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="space-y-4 py-6 rounded-lg bg-background border-none">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-md bg-red-500/20">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-red-400 text-lg">
              This key will only be shown once
            </h3>
            <p className="text-sm text-slate-300 mt-0">
              Copy and save it now in a secure location. There's no way to
              recover it later.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-red-950/30 border border-red-500/40">
          <div className="flex items-center gap-3 font-mono text-sm text-slate-200">
            <span className="flex-1 truncate">{inputKey}</span>
            <Button
              onClick={handleCopy}
              variant="destructive"
              title="Copy API key"
              size="icon"
            >
              {copied ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <Copy className="w-4 h-4 text-white" />
              )}
            </Button>
          </div>
        </div>

        <div className="text-xs text-red-300 space-y-1">
          <p>
            <span className="font-bold">Full Access key :</span> This key has
            access to all the API endpoints and can substitute the web cookies
            used for this web interface. DO NOT have this easily accessible.
          </p>
        </div>
      </div>
    </div>
  )
}

export function ApiKeyCreateDialog({
  children,
  onChange,
}: ApiKeyCreateDialogProps) {
  const form = useForm<z.infer<typeof ApiKeyCreateSchema>>({
    resolver: zodResolver(ApiKeyCreateSchema),
    defaultValues: {
      name: "",
    },
  })

  const { isDialogOpen, setDialogState } = useDialogueManager()
  const [createdKey, setCreatedKey] = useState<string | undefined>(undefined)
  const [isCreating, setIsCreating] = useState(false)

  const onSubmit = async (values: z.infer<typeof ApiKeyCreateSchema>) => {
    setIsCreating(true)
    try {
      const apiKey = await onChange(values.name)
      console.log("apiKey", apiKey)
      setCreatedKey(apiKey)
    } catch (error) {
      toast({
        title: "Failed to create API key",
        variant: "destructive",
        duration: 2000,
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDialogClose = (open: boolean) => {
    if (!open && !createdKey) {
      setDialogState(false)
    } else if (!open && createdKey) {
    } else if (open) {
      setDialogState(true)
      form.reset()
      setCreatedKey(undefined)
    }
  }

  const handleAcknowledged = () => {
    setCreatedKey(undefined)
    form.reset()
    setDialogState(false)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger
        asChild
        onClick={e => {
          e.preventDefault()
          setDialogState(true)
        }}
      >
        {children}
      </DialogTrigger>
      <DialogContent
        className="sm:min-w-[425px] sm:max-w-none w-auto text-foreground bg-background transition-all duration-300 ease-in-out"
        onPointerDownOutside={e => {
          e.preventDefault()
        }}
        onEscapeKeyDown={e => {
          if (createdKey) {
            e.preventDefault()
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>
            {createdKey
              ? "Your API key has been created"
              : "Enter a name for your new API key"}
          </DialogDescription>
        </DialogHeader>
        {createdKey ? (
          <div className="space-y-4">
            <KeyWarningComponent inputKey={createdKey} />
            <DialogFooter>
              <Button onClick={handleAcknowledged}>I've saved my key</Button>
            </DialogFooter>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key name*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Production API Key"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A meaningful name to identify this key
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create API Key"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
