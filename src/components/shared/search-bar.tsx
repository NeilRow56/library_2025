import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

export default function SearchBar() {
  async function doSearch(formData: FormData) {
    'use server'

    const search_by = formData.get('search_by')
    const search = formData.get('search')

    console.log(search_by, search)
  }

  return (
    <form action={doSearch}>
      <div className='flex w-full flex-col space-y-2 sm:max-w-[800px] sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2'>
        <p className='mt-2 min-w-[70px] text-sm text-slate-500 sm:mt-0'>
          Search by
        </p>
        <Select name='search_by'>
          <SelectTrigger className='w-full'>
            <SelectValue
              placeholder='Keyword'
              className='text-muted-foreground'
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='title'>Title</SelectItem>
            <SelectItem value='category'>Category</SelectItem>
          </SelectContent>
        </Select>
        <Input
          className='text-muted-foreground min-w-[250px]'
          placeholder='Search...'
          name='search'
          type='search'
        />
        <Button type='submit'>Search</Button>
      </div>
    </form>
  )
}
