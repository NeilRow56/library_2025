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

export async function categoryAlreadyExists(name: string) {
  return db.query.book_categories.findFirst({
    where: eq(book_categories.name, name)
  })
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

      // New Category

      // createdAt and updatedAt are set by the database

      const existingCategory = await categoryAlreadyExists(category.name)

      if (existingCategory) {
        throw Error(`Category already exists. Please choose another category`)
      }

      if (category.id === '') {
        const result = await db

          .insert(book_categories)
          .values({
            name: category.name,
            userId: category.userId
          })
          .returning({ insertedId: book_categories.id })

        return {
          message: `Client ID #${result[0].insertedId} created successfully`
        }
      }

      // Existing category
      // updatedAt is set by the database
      const result = await db
        .update(book_categories)
        .set({
          name: category.name,
          userId: category.userId
        })
        // ! confirms category.id will always exist for the update function
        .where(eq(book_categories.id, category.id!))
        .returning({ updatedId: book_categories.id })

      return {
        message: `Client ID #${result[0].updatedId} updated successfully`
      }
    }
  )
