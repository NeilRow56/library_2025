'use server'

import { db } from '@/db'

import { book_categories, BookCategories } from '@/db/schema'
import { auth } from '@/lib/auth'
import { actionClient } from '@/lib/safe-action'
import {
  insertCategorySchema,
  insertCategorySchemaType
} from '@/zod-schemas/categories'

import { and, asc, eq } from 'drizzle-orm'
import { flattenValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const getUserCategories = async (userId: string) => {
  const categoriesByUserId = await db
    .select({
      id: book_categories.id,
      name: book_categories.name,
      userId: book_categories.userId
    })
    .from(book_categories)
    .where(and(eq(book_categories.userId, userId)))
    .orderBy(asc(book_categories.name))

  return categoriesByUserId
}

export async function getCategoryTwo(id: string) {
  const category = await db
    .select()
    .from(book_categories)
    .where(eq(book_categories.id, id))

  return category[0]
}

//use-safe-actions

export const saveCategoryAction = actionClient
  .metadata({ actionName: 'saveClientAction' })
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
        revalidatePath('/admin/categories')
        return {
          message: `Category ID #${result[0].insertedId} created successfully`
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
        // ! confirms customer.id will always exist for the update function
        .where(eq(book_categories.id, category.id!))
        .returning({ updatedId: book_categories.id })
      revalidatePath('/admin/categories')
      return {
        message: `Client ID #${result[0].updatedId} updated successfully`
      }
    }
  )

export const deleteCategory = async (id: string) => {
  try {
    await db.delete(book_categories).where(eq(book_categories.id, id))
    return { success: true, message: 'Category deleted successfully' }
  } catch {
    return { success: false, message: 'Failed to delete category' }
  }
}

export async function createCategory(category: BookCategories) {
  try {
    await db.insert(book_categories).values(category)
    // return { success: true, message: 'Client created successfully' }
  } catch (error) {
    console.error(error)
    // return { success: false, message: 'Failed to create client' }
    return {
      error: 'Failed to create category '
    }
  }
}

export async function updateCategory(category: BookCategories) {
  try {
    await db
      .update(book_categories)
      .set(category)
      .where(eq(book_categories.id, category.id))
  } catch (error) {
    console.error(error)
    return { error: 'Failed to update customer' }
  }
  revalidatePath('/admin/categories')
}
