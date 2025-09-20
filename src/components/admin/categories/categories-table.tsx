import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import { Pencil } from 'lucide-react'

import { getCurrentUserId } from '@/server/users'
import { redirect } from 'next/navigation'
import { EmptyState } from '@/components/shared/emply-state'
import { getUserCategories } from '@/server/categories'

export default async function CustomersTable() {
  const { userId } = await getCurrentUserId()
  if (userId == null) return redirect('/auth/sign-in')

  const categories = await getUserCategories(userId)

  console.log(categories)

  if (customers.length === 0) {
    return (
      <>
        <div className='mx-auto flex max-w-6xl flex-col gap-2'>
          <EmptyState
            title='Categoriess'
            description='You have no categories yet. Click on the button above to create your first category'
          />
        </div>
      </>
    )
  }

  return (
    <Table>
      <TableCaption>
        When editing customer information the original details are retained in
        the form until you close it. This is in case you want to revert to the
        original information..
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[100px]'>ID</TableHead>
          <TableHead className='w-[100px]'>Email</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead>UserId</TableHead>
          <TableHead className='text-right'>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map(customer => (
          <TableRow key={customer.id}>
            <TableCell className='font-medium'>
              {customer.id.slice(0, 8)}
            </TableCell>
            <TableCell className='font-medium'>{customer.email}</TableCell>
            <TableCell>{customer.username}</TableCell>
            <TableCell>{customer?.notes}</TableCell>
            <TableCell className='font-medium'>
              {customer.userId.slice(0, 8)}
            </TableCell>
            <TableCell className='text-right'>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='ghost'>
                    <Pencil className='size-4' />
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <CreateCustomerButton customer={customer} />
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <DeleteCustomerButton customerId={customer.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
