import { CreateCategoryButton } from '@/components/admin/categories/create-category-button'
import { SkeletonCustomerCard } from '@/components/admin/skeleton-customer-card'

import { SkeletonArray } from '@/components/shared/skeleton'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { Suspense } from 'react'

export default async function Categories() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect('/auth/sign-in')
  }

  const userId = session.session.userId
  return (
    <div className='mx-auto flex max-w-7xl min-w-5xl flex-col gap-4 p-4 md:p-24'>
      <div className='flex justify-between'>
        <div className='mb-12'>
          <h1 className='text-2xl font-bold'>Categories</h1>
        </div>
        <CreateCategoryButton userId={userId} />
      </div>
      <div className=''>
        <Suspense
          fallback={
            <SkeletonArray amount={3}>
              <SkeletonCustomerCard />
            </SkeletonArray>
          }
        >
          {/* <CategoriesTable /> */}
        </Suspense>
      </div>
    </div>
  )
}
