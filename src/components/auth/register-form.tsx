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

// import { signUp } from '@/lib/auth-client'
import { toast } from 'sonner'
import { signUp } from '@/server/users'

const registerSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.email('Please enter a valid email address!'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, {
      message: 'Passwords do not match'
    })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],

    // run if password & confirmPassword are valid
    when(payload) {
      return registerSchema
        .pick({ password: true, confirmPassword: true })
        .safeParse(payload.value).success
    }
  })
type RegisterSchemaType = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSuccess?: () => void
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  // async function onSubmit(values: RegisterSchemaType) {
  //   setIsLoading(true)
  //   try {
  //     const { error } = await signUp.email({
  //       name: values.name,
  //       email: values.email,
  //       password: values.password
  //     })

  //     if (error) {
  //       toast('Failed to create account. Plerase try again')
  //       return
  //     }
  //     toast(
  //       'Your account has been created successfully. Please sign in with email and password'
  //     )

  //     if (onSuccess) {
  //       onSuccess()
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  async function onSubmit(values: RegisterSchemaType) {
    setIsLoading(true)

    const { success, message } = await signUp(
      values.email,
      values.password,
      values.name
    )

    if (success) {
      toast.success(
        `${message as string} Please check your email for verification.`
      )
      // router.push('/')
      if (onSuccess) {
        onSuccess()
      }
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
                <h1 className='text-2xl font-bold'>Welcome!</h1>
                <p className='text-muted-foreground text-balance'>
                  Create your account
                </p>
              </div>
              <div className='grid gap-3'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-primary font-bold'>
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='e.g. John Doe' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid gap-3'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-primary font-bold'>
                        Email
                      </FormLabel>
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
                      <FormLabel className='text-primary font-bold'>
                        Password
                      </FormLabel>
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
              <div className='grid gap-3'>
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-primary font-bold'>
                        Confirm Password
                      </FormLabel>
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
                  'Register'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
