import { SkeletonArray } from '@/components/shared/skeleton'

import { SkeletonCustomerCard } from '@/components/admin/skeleton-customer-card'
import CategoriesByUserId2Table from '@/components/admin/categories/categories-table'
import { Suspense } from 'react'

export const metadata = {
  title: 'Client Search'
}

export default async function Categories() {
  return (
    <>
      <div>
        <Suspense
          fallback={
            <SkeletonArray amount={3}>
              <SkeletonCustomerCard />
            </SkeletonArray>
          }
        >
          <CategoriesByUserId2Table />
        </Suspense>
      </div>
    </>
  )
}
