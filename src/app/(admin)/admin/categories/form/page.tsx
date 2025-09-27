import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getCategoryTwo, getCategoryUser } from '@/server/categories'
import { CategoryForm } from '@/components/admin/categories/category-form'

import { BackButton } from '@/components/shared/back-button'

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const { categoryId } = await searchParams

  if (!categoryId) return { title: 'New Category' }

  return { title: `Edit Category #${categoryId}` }
}

export default async function CategoryFormPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  try {
    const { categoryId } = await searchParams

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      redirect('/auth')
    }

    const userId = session.session.userId

    if (!userId && !categoryId) {
      return (
        <>
          <h2 className='mb-2 text-2xl'>
            Category ID OR User ID required to load category form
          </h2>
          <BackButton title='Go Back' variant='default' className='w-[100px]' />
        </>
      )
    }

    // New client form
    if (userId) {
      const user = await getCategoryUser(userId)

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

      //   if (!client.active) {
      //     return (
      //       <>
      //         <h2 className='mb-2 text-2xl'>
      //           Client ID #{clientId} is not active.
      //         </h2>
      //         <BackButton title='Go Back' variant='default' />
      //       </>
      //     )
      //   }

      // return client form
      if (userId && !categoryId) {
        return (
          <div className='flex h-dvh w-full bg-gray-100'>
            <CategoryForm user={user} />
          </div>
        )
      }
    }

    // Edit client form
    if (categoryId) {
      const category = await getCategoryTwo(categoryId)

      if (!category) {
        return (
          <>
            <h2 className='mb-2 text-2xl'>
              Category ID #{categoryId} not found
            </h2>
            <BackButton title='Go Back' variant='default' />
          </>
        )
      }

      const user = await getCategoryUser(category.userId)

      if (userId !== category.userId) {
        return (
          <>
            <h2 className='mb-2 text-2xl'>
              Client-user ID and current-session-user ID do not match
            </h2>

            <BackButton
              title='Go Back'
              variant='default'
              className='w-[100px]'
            />
          </>
        )
      }

      // return client form

      return (
        <div className='flex h-dvh w-full bg-gray-100'>
          <CategoryForm category={category} user={user} />
        </div>
      )
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
  }
}
