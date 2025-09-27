// 'use client'

// import { Category, columns } from '@/app/(admin)/admin/categories/columns'

// import React from 'react'

// import { Button } from '@/components/ui/button'
// import Link from 'next/link'
// import { EmptyState } from '@/components/shared/emply-state'
// import { DataTable } from '@/app/(admin)/admin/categories/data-table'

// type Props = {
//   data: {
//     id: string
//     name: string
//   }[]
//   total: number
// }

// export default function CatsWithActionsTable({ data, total }: Props) {
//   const handleRowDelete = (item: Category) => {
//     // setOpenConfirmationDialog(true)
//     // setItemToAction(item)
//     console.log('delete item', item)
//   }

//   const handleRowEdit = (item: Category) => {
//     // setItemToAction(item)
//     // setOpen(true)
//     console.log('edit item', item)
//   }

//   if (total === 0) {
//     return (
//       <>
//         <div className='mx-auto flex max-w-6xl flex-col gap-2'>
//           <EmptyState
//             title='Categories'
//             description='You have no categories yet. Click on the button below to create your first category'
//           />
//         </div>

//         <div className='- mt-12 flex w-full justify-center'>
//           <Button asChild size='lg' className='i flex w-[200px]'>
//             <Link href='/admin/categories/form'>Create Category</Link>
//           </Button>
//           {/* <AddCategoryButton user={user} /> */}
//         </div>
//       </>
//     )
//   }

//   return (
//     <div className='container mx-auto my-12 max-w-6xl'>
//       <div className='mb-12 flex w-full items-center justify-between'>
//         <span className='text-3xl font-bold'>Categories </span>

//         <Button asChild size='sm' className='flex'>
//           <Link href='/admin/categories/form'>Create category</Link>
//         </Button>
//         {/* <AddCategoryButton user={user} /> */}
//       </div>
//       <DataTable
//         data={data}
//         columns={columns}
//         onRowDelete={handleRowDelete}
//         onRowEdit={handleRowEdit}
//       />
//     </div>
//   )
// }
