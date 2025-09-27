import { SkeletonArray } from '@/components/shared/skeleton'

import { SkeletonCustomerCard } from '@/components/admin/skeleton-customer-card'
import CategoriesByUserId2Table from '@/components/admin/categories/categories-table'
import { Suspense } from 'react'
import CatsTable from '@/components/admin/categories/cats-table'
import { getCurrentUserId, getUserDetails } from '@/server/users'
import { redirect } from 'next/navigation'
import { BackButton } from '@/components/shared/back-button'
import { db } from '@/db'
import { book_categories } from '@/db/schema'
import { and, asc, count, eq } from 'drizzle-orm'
import { EmptyState } from '@/components/shared/emply-state'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AddCategoryButton } from '@/components/admin/categories/create-category-button'
import { columns } from './columns'
import { DataTable } from './data-table'

export const metadata = {
  title: 'Client Search'
}

export default async function Categories({
  searchParams
}: {
  searchParams: { page: string | undefined; limit: string | undefined }
}) {
  const { userId } = await getCurrentUserId()
  if (userId == null) return redirect('/auth/sign-in')

  if (userId) {
    const user = await getUserDetails(userId)

    if (!user) {
      return (
        <>
          <h2 className='mb-2 text-2xl'>User ID #{userId} not found</h2>
          <BackButton
            title='Go Back'
            variant='default'
            className='flex w-[100px]'
          />
        </>
      )
    }

    const params = await searchParams

    const page = parseInt(params.page || '0') + 1
    const take = parseInt(params.limit || '10')

    const data = await getUserCategories(userId, page, take)
    type Result = { count: number }
    const dbCount = await db.select({ count: count() }).from(book_categories)

    const arr: Result[] = dbCount

    const total: number = arr.reduce((sum, result) => sum + result.count, 0)

    if (data.length === 0) {
      return (
        <>
          <div className='mx-auto flex max-w-6xl flex-col gap-2'>
            <EmptyState
              title='Categories'
              description='You have no categories yet. Click on the button below to create your first category'
            />
          </div>

          <div className='- mt-12 flex w-full justify-center'>
            {/* <Button asChild size='lg' className='i flex w-[200px]'>
              <Link href='/admin/categories/form'>Create Category</Link>
            </Button> */}
            <AddCategoryButton user={user} />
          </div>
        </>
      )
    }
    return (
      <>
        <div className='container mx-auto max-w-2xl py-10'>
          <Suspense
            fallback={
              <SkeletonArray amount={3}>
                <SkeletonCustomerCard />
              </SkeletonArray>
            }
          >
            {/* <CategoriesByUserId2Table /> */}
            {/* <CatsTable data={data} total={total} /> */}
            <DataTable columns={columns} data={data} />
          </Suspense>
        </div>
      </>
    )
  }
}
async function getUserCategories(userId: string, page: number, take: number) {
  const categoriesByUserId = await db
    .select({
      id: book_categories.id,
      name: book_categories.name,
      userId: book_categories.userId
    })
    .from(book_categories)
    .offset(page - 1)
    .limit(take)
    .where(and(eq(book_categories.userId, userId)))
    .orderBy(asc(book_categories.name))

  return categoriesByUserId
}
