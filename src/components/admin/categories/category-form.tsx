'use client'

import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'

import { BookCategories, User } from '@/db/schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputWithLabel } from '@/components/form/input-with-label'

import {
  insertCategorySchema,
  insertCategorySchemaType
} from '@/zod-schemas/categories'
import { useAction } from 'next-safe-action/hooks'
import { saveCategoryAction } from '@/server/categories'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'

interface CategoryFormProps {
  user: User // You must have a user to start a customer - so it is not optional
  category?: BookCategories
}

export const CategoryForm = ({ user, category }: CategoryFormProps) => {
  const defaultValues: insertCategorySchemaType = {
    id: category?.id ?? '',
    name: category?.name ?? '',
    userId: category?.userId ?? user.id
  }
  const form = useForm<insertCategorySchemaType>({
    resolver: zodResolver(insertCategorySchema),
    mode: 'onBlur',
    defaultValues
  })

  const {
    execute: executeSave,
    // result: saveResult,
    isPending: isSaving,
    reset: resetSaveAction
  } = useAction(saveCategoryAction, {
    onSuccess({ data }) {
      if (data?.message) {
        toast.success(
          `Category ${category ? 'updated ' : 'added'} successfully`
        )
        form.reset()
      }
    },
    onError({ error }) {
      console.log(error)
      toast.error(`Failed to ${category ? 'update' : 'add'} category`)
    }
  })

  async function submitForm(data: insertCategorySchemaType) {
    executeSave(data)
  }
  return (
    <div className='container mx-auto mt-24'>
      <div className='flex flex-col gap-1 text-center sm:px-8'>
        {/* <DisplayServerActionResponse result={saveResult} /> */}
        <div className='items-center justify-center'>
          <h2 className='text-primary text-2xl font-bold lg:text-3xl'>
            {category?.id ? 'Edit' : 'New'} Category{' '}
            {category?.id ? `#${category.id}` : 'Form'}
          </h2>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitForm)}
            className='mx-auto mt-8 flex w-4xl flex-col gap-4 rounded-lg border p-8 md:gap-8 xl:flex-row'
          >
            <div className='flex w-full flex-col gap-4'>
              <FormField
                control={form.control}
                name='userId'
                render={({ field }) => (
                  <FormItem className='hidden'>
                    <FormControl>
                      <Input placeholder='' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <InputWithLabel<insertCategorySchemaType>
                fieldTitle='Name'
                nameInSchema='name'
              />

              <div className='flex max-w-lg justify-between'>
                <Button
                  type='submit'
                  className='w-1/4'
                  variant='default'
                  title='Save'
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <LoaderCircle className='animate-spin' /> Saving
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>

                <Button
                  type='button'
                  className='w-1/4'
                  variant='destructive'
                  title='Reset'
                  onClick={() => {
                    form.reset(defaultValues)
                    resetSaveAction()
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
