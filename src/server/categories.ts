'use server'

import { db } from '@/db'

import { book_categories, user } from '@/db/schema'
import { auth } from '@/lib/auth'
import { actionClient } from '@/lib/safe-action'
import {
  insertCategorySchema,
  insertCategorySchemaType
} from '@/zod-schemas/categories'

import { eq } from 'drizzle-orm'
import { flattenValidationErrors } from 'next-safe-action'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getCategoryUser(id: string) {
  const userDetails = await db.select().from(user).where(eq(user.id, id))

  return userDetails[0]
}

export async function getCategoryTwo(id: string) {
  const category = await db
    .select()
    .from(book_categories)
    .where(eq(book_categories.id, id))

  return category[0]
}

export const deleteCategory = async (id: string) => {
  try {
    await db.delete(book_categories).where(eq(book_categories.id, id))
    return { success: true, message: 'Category deleted successfully' }
  } catch {
    return { success: false, message: 'Failed to delete category' }
  }
}

//use-safe-actions

export const saveCategoryAction = actionClient
  .metadata({ actionName: 'saveCategoryAction' })
  .inputSchema(insertCategorySchema, {
    handleValidationErrorsShape: async ve =>
      flattenValidationErrors(ve).fieldErrors
  })
  .action(
    async ({
      parsedInput: category
    }: {
      parsedInput: insertCategorySchemaType
    }) => {
      const session = await auth.api.getSession({
        headers: await headers()
      })

      if (!session) redirect('/auth/sign-in')

      // ERROR TESTS

      // throw Error('test error client create action')

      // New Client
      // All new clients are active by default - no need to set active to true
      // createdAt and updatedAt are set by the database

      if (category.id === '') {
        const result = await db

          .insert(book_categories)
          .values({
            name: category.name,
            userId: category.userId
          })
          .returning({ insertedId: book_categories.id })
        redirect('/admin/categories')
        return {
          message: `Client ID #${result[0].insertedId} created successfully`
        }
      }

      // Existing client
      // updatedAt is set by the database
      const result = await db
        .update(book_categories)
        .set({
          name: category.name,
          userId: category.userId
        })
        // ! confirms customer.id will always exist for the update function
        .where(eq(book_categories.id, category.id!))
        .returning({ updatedId: book_categories.id })
      redirect('/admin/clients')
      return {
        message: `Client ID #${result[0].updatedId} updated successfully`
      }
    }
  )
