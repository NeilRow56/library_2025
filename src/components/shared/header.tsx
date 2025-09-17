'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { Button } from '../ui/button'

const navItems = [
  {
    label: 'Home',
    href: '/'
  },
  {
    label: 'Create post',
    href: '/post/create'
  }
]

export default function Header() {
  return (
    <header className='sticky top-0 z-10 border-b'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <div className='flex items-center gap-6'>
          <Link href='/' className='text-xl font-bold'>
            {' '}
            Nextjs Blog 2025
          </Link>
          <nav className='hidden items-center gap-6 md:flex'>
            {navItems.map(item => (
              <Link
                className={cn(
                  'hover:text-primary text-sm font-medium transition-colors'
                )}
                key={item.href}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className='flex items-center gap-4'>
          <div className='hidden md:block'>
            {/* Keep a placeholder for search */}
          </div>
          <ThemeToggle />
          <div className='flex items-center gap-2'>
            <Button variant='default' asChild>
              <Link href='/auth'>Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
