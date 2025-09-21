'use client'

import { Loader2, PencilIcon, Trash2 } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { deleteCategory } from '@/server/categories'

interface DeleteCategoryButtonProps {
  categoryId: string
}

export default function DeleteCategoryButton({
  categoryId
}: DeleteCategoryButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      await deleteCategory(categoryId)
      toast.success('Category deleted successfully')
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete category')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' className='cursor-pointer'>
          <Trash2 className='size-4 text-red-500' />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            category and remove your data from our servers.
          </DialogDescription>
          <Button variant='ghost'>
            <PencilIcon className='size-4' />
          </Button>
          <Button
            disabled={isLoading}
            variant='destructive'
            onClick={handleDelete}
          >
            {isLoading ? <Loader2 className='size-4 animate-spin' /> : 'Delete'}
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
