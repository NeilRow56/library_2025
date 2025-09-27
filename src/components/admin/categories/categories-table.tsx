import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import { PencilIcon } from 'lucide-react'

import { getCurrentUserId, getUserDetails } from '@/server/users'
import { redirect } from 'next/navigation'
import { EmptyState } from '@/components/shared/emply-state'

import DeleteCategoryButton from './delete-category-button'
import { Button } from '@/components/ui/button'

import { BackButton } from '@/components/shared/back-button'
import { book_categories } from '@/db/schema'
import { and, asc, eq } from 'drizzle-orm'
import { db } from '@/db'
import Link from 'next/link'
import { AddCategoryButton } from './create-category-button'

export default async function CategoriesByUserId2Table() {
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

    const categories = await getUserCategories(userId)

    if (categories.length === 0) {
      return (
        <>
          <div className='mx-auto flex max-w-6xl flex-col gap-2'>
            <EmptyState
              title='Categories'
              description='You have no categories yet. Click on the button below to create your first category'
            />
          </div>

          <div className='- mt-12 flex w-full justify-center'>
            <Button asChild size='lg' className='i flex w-[200px]'>
              <Link href='/admin/categories/form'>Create Category</Link>
            </Button>
            {/* <AddCategoryButton user={user} /> */}
          </div>
        </>
      )
    }

    return (
      <div className='container mx-auto my-12 max-w-2xl'>
        <div className='mb-12 flex w-full items-center justify-between'>
          <span className='text-3xl font-bold'>Categories</span>

          {/* <Button asChild size='sm' className='flex'>
            <Link href='/admin/categories/form'>Create category</Link>
          </Button> */}
          <AddCategoryButton user={user} />
        </div>

        <Table>
          <TableCaption className='text-xl font-bold'>
            A list of your categories.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>ID</TableHead>
              <TableHead>Name</TableHead>

              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map(category => (
              <TableRow key={category.id}>
                <TableCell className='font-medium'>
                  {' '}
                  {category.id.slice(0, 8)}
                </TableCell>
                <TableCell>{category.name}</TableCell>

                <TableCell className='space-x-2 text-right'>
                  <div className='mr-auto gap-5 space-x-2'>
                    <Button asChild variant='outline'>
                      <Link
                        href={`/admin/categories/form?categoryId=${category.id}`}
                      >
                        <PencilIcon />
                      </Link>
                    </Button>
                    <DeleteCategoryButton categoryId={category.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
}

async function getUserCategories(userId: string) {
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
