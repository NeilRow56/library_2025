'use server'

import { db } from '@/db'

import { book_categories, BookCategories } from '@/db/schema'

import { and, asc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export const getUserCategories = async (userId: string) => {
  try {
    const categoriesByUserId = await db
      .select({
        id: book_categories.id,
        name: book_categories.name,
        userId: book_categories.userId
      })
      .from(book_categories)
      .where(and(eq(book_categories.userId, userId)))
      .orderBy(asc(book_categories.name))

    return { success: true, categories: categoriesByUserId }
  } catch {
    return { success: false, message: 'Failed to get categories' }
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

export async function deleteCategory(id: string) {
  try {
    await db.delete(book_categories).where(eq(book_categories.id, id))
  } catch (error) {
    console.error(error)
    return { error: 'Failed to delete category' }
  }
}
