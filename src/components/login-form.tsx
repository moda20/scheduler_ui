import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback } from "react"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { PasswordInput } from "@/components/ui/password-input"

export interface LoginFormProps extends React.ComponentProps<"div"> {
  onLoginSubmit: (data: any) => void
  onRegisterSubmit: (data: any) => void
}

const LoginFormSchema = z.object({
  email: z.string(),
  password: z.string(),
})

const RegisterFormSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
})

export type LoginFormType = z.infer<typeof LoginFormSchema>
export type RegisterFormType = z.infer<typeof RegisterFormSchema>

export function LoginForm({
  className,
  onLoginSubmit,
  onRegisterSubmit,
  ...props
}: LoginFormProps) {
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
  })
  const registerForm = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
  })

  const resetState = useCallback(
    (finalState: boolean) => {
      if (!finalState) {
        form.reset()
      }
    },
    [form],
  )

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden text-foreground bg-background border-none rounded-t-xl">
        <CardContent className="grid gap-2 justify-between p-0 md:grid-cols-[1fr_auto_1fr] text-foreground bg-background border-border rounded-t-xl">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                v => {
                  onLoginSubmit(v)
                },
                err => {
                  console.log(err)
                },
              )}
            >
              <div className="flex flex-col gap-6 h-full">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-balance text-muted-foreground">
                    Login to your account
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <div>
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your email" {...field} />
                        </FormControl>
                        <FormDescription>
                          Input your login email.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <div>
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <PasswordInput placeholder="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Input your login password.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />
                <Button type="submit" className="w-full mt-auto">
                  Login
                </Button>
              </div>
            </form>
          </Form>
          <div className="w-[40px] flex flex-col justify-center items-center font-bold">
            OR
          </div>
          <Form {...registerForm}>
            <form
              onSubmit={registerForm.handleSubmit(
                v => {
                  onRegisterSubmit(v)
                },
                err => {
                  console.log(err)
                },
              )}
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">New on this server?</h1>
                  <p className="text-balance text-muted-foreground">
                    Create an account
                  </p>
                </div>
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <div>
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Username" {...field} />
                        </FormControl>
                        <FormDescription>Input your username.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <div>
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormDescription>
                          Input your login email.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <div>
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <PasswordInput placeholder="Password" {...field} />
                        </FormControl>
                        <FormDescription>Input your password.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />
                <Button type="submit" className="w-full">
                  Register
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary"></div>
    </div>
  )
}
