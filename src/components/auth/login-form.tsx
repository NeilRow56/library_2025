'use client'

import { useState } from 'react'
import * as z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { signIn } from '@/server/users'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const loginSchema = z.object({
  email: z.email('Please enter a valid email address!'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

type LoginSchemaType = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit(values: LoginSchemaType) {
    setIsLoading(true)
    const { success, message } = await signIn(values.email, values.password)

    if (success) {
      toast.success(message as string)
      router.push('/admin')
    } else {
      toast.error(message as string)
    }

    setIsLoading(false)
  }
  return (
    <Card className='overflow-hidden p-0'>
      <CardContent className='flex w-full max-w-sm flex-col gap-6 md:max-w-3xl'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='px-6 pt-6 pb-2 md:px-8 md:pt-8'
          >
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col items-center text-center'>
                <h1 className='text-2xl font-bold'>Welcome back!</h1>
                <p className='text-muted-foreground text-balance'>
                  Login to your account
                </p>
              </div>
              <div className='grid gap-3'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='e.g. m@example.com'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid gap-3'>
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='********'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type='submit'
                className='w-full cursor-pointer dark:bg-blue-600 dark:text-white'
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className='size-4 animate-spin' />
                ) : (
                  'Login'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
