'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { toast } from 'sonner'

import { useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

import { getSession } from '@/lib/auth-client'
import { BookCategories, User } from '@/db/schema'
import {
  insertCategorySchema,
  insertCategorySchemaType
} from '@/zod-schemas/categories'
import { createCategory, updateCategory } from '@/server/categories'

interface CategoryFormProps {
  category?: BookCategories
  userId: string
}

export const CreateCategoryButton = ({
  category,
  userId
}: CategoryFormProps) => {
  const closeRef = useRef(null)
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<insertCategorySchemaType>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: {
      name: category?.name ?? '',
      userId: category?.userId ?? userId
    }
  })

  async function onSubmit(values: insertCategorySchemaType) {
    try {
      setIsLoading(true)
      const userId = (await getSession()).data?.user.id

      if (!userId) {
        toast.error('You must be logged in to create a customer')
        return
      }

      const categoryData = {
        ...values,
        userId
      }

      if (category) {
        await updateCategory({
          ...categoryData,
          id: category.id
        })
      } else {
        await createCategory(categoryData)
      }

      toast.success(`Customer ${category ? 'updated ' : 'added'} successfully`)
      router.refresh()
      setIsOpen(false)
      form.reset()
    } catch {
      toast.error(`Failed to ${category ? 'update' : 'add'} category`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='w-max'>
          {category ? 'Edit Category details.' : 'Create Category'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? 'Update Category' : 'Create Category'}
          </DialogTitle>
          <DialogDescription>
            {category
              ? 'Update Category information.'
              : 'Create a new category for your database.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='userId'
              render={({ field }) => (
                <FormItem className='hidden'>
                  <FormLabel></FormLabel>
                  <FormControl>
                    <Input placeholder='Bruce Wayne' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder='category name...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isLoading} type='submit'>
              {isLoading ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                `${category ? 'Update' : 'Add'} Category`
              )}
            </Button>
            {/* Hidden button to close the dialog */}
            <DialogClose asChild>
              <button type='button' ref={closeRef} className='hidden' />
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
