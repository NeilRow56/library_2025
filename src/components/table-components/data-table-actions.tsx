'use client'

import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '../ui/button'
import { MoreHorizontal } from 'lucide-react'
import { ColumnDef, Row, Table } from '@tanstack/react-table'

export type GenericColumnDef<T> = ColumnDef<T, unknown>

interface DataTableActionProps<TData> {
  row: Row<TData>
  table: Table<TData>
  edit_label?: string
}

function DataTableActions<TData>({
  row,
  table,
  edit_label
}: DataTableActionProps<TData>) {
  const item = row.original
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel className='font-bold text-blue-600'>
          Actions
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => table.options.meta?.onEdit(item)}>
          {edit_label ? edit_label : 'Edit'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => table.options.meta?.onDelete(item)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type RowActionProps = {
  edit_label?: string
}

export function CreateRowActions<T>({
  edit_label
}: RowActionProps = {}): GenericColumnDef<T> {
  return {
    id: 'actions',
    enableHiding: false,
    header: () => <div className='text-center'>Actions</div>,
    cell: ({ row, table }) => (
      <div className='flex w-full justify-center'>
        <DataTableActions row={row} table={table} edit_label={edit_label} />
      </div>
    )
  }
}
