import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import { Suspense } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { db } from '@/db'
import { clients } from '@/db/schema'
import { and, asc, eq } from 'drizzle-orm'
import { getCurrentUserId } from '@/server/users'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

import { PencilIcon } from 'lucide-react'
import { EmptyState } from '@/components/shared/emply-state'

import DeleteClientButton from '@/components/admin/clients/delete-client-button'
import {
  SkeletonArray,
  SkeletonButton,
  SkeletonText
} from '@/components/shared/skeleton'

export const metadata = {
  title: 'Client Search'
}

export default async function Clients() {
  return (
    <>
      <div>
        <Suspense
          fallback={
            <SkeletonArray amount={3}>
              <SkeletonClientCard />
            </SkeletonArray>
          }
        >
          <ClientsByUserIdTable />
        </Suspense>
      </div>
    </>
  )
}

async function ClientsByUserIdTable() {
  const { userId } = await getCurrentUserId()
  if (userId == null) return redirect('/auth/sign-in')

  const clients = await getUserClients(userId)

  if (clients.length === 0) {
    return (
      <>
        <div className='mx-auto flex max-w-6xl flex-col gap-2'>
          <EmptyState
            title='Clients'
            description='You have no clients yet. Click on the button below to create your first
          client'
          />
        </div>

        <div className='- mt-12 flex w-full justify-center'>
          <Button asChild size='lg' className='i flex w-[200px]'>
            <Link href='/admin/clients/form'>Create Client</Link>
          </Button>
        </div>
      </>
    )
  }

  return (
    <div className='container mx-auto my-6 max-w-2xl'>
      <div className='flex w-full items-center justify-between'>
        <span className='text-xl font-bold'>Clients</span>

        <Button asChild size='sm' className='flex'>
          <Link href='/admin/clients/form'>Create Client</Link>
        </Button>
      </div>

      <Table>
        <TableCaption className='text-xl font-bold'>
          A list of your clients.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>ID</TableHead>
            <TableHead>Name</TableHead>

            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map(client => (
            <TableRow key={client.id}>
              <TableCell className='font-medium'>
                {client.id.slice(0, 8)}
              </TableCell>
              <TableCell>{client.name}</TableCell>

              <TableCell className='space-x-2 text-right'>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='ghost' className='cursor-pointer'>
                      <PencilIcon className='size-4 text-red-500' />
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Client</DialogTitle>
                      Client Form
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                {/* <Button variant='ghost' className='mr-2 cursor-pointer'>
                    <PencilIcon />
                  </Button> */}
                <DeleteClientButton clientId={client.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function SkeletonClientCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <SkeletonText className='w-3/4' />
        </CardTitle>
        <CardDescription>
          <SkeletonText className='w-1/2' />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SkeletonText rows={3} />
      </CardContent>
      <CardFooter>
        <SkeletonButton />
      </CardFooter>
    </Card>
  )
}

async function getUserClients(userId: string) {
  const clientsByUserId = await db
    .select({
      id: clients.id,
      name: clients.name,
      userId: clients.userId
    })
    .from(clients)
    .where(and(eq(clients.userId, userId)))
    .orderBy(asc(clients.name))

  return clientsByUserId
}
