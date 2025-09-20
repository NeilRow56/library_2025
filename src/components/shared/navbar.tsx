'use client'

import * as React from 'react'
import Link from 'next/link'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'
import { User2Icon } from 'lucide-react'

export function Navbar() {
  return (
    <nav className='hidden w-full bg-black text-white sm:block'>
      <div className='container mx-auto flex items-center justify-between px-2 py-4'>
        <div className='flex items-center space-x-8'>
          <Link className='hover:text-gray-400' href='/'>
            {' '}
            Catalogue
          </Link>
          <Link className='hover:text-gray-400' href='/'>
            {' '}
            Locations
          </Link>
          <Link className='hover:text-gray-400' href='/'>
            {' '}
            Activities
          </Link>

          <NavigationMenu className='text-gray-800' viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Library resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className='grid w-[300px] gap-4'>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href='library-card'>
                          <div className='font-medium'>Library card</div>
                          <p className='text-muted-foreground text-sm text-wrap'>
                            Use your library card to borrow materials, access
                            digital resources, and explore library technology.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href='book-a-room'>
                          <div className='font-medium'>Book a room</div>
                          <p className='text-muted-foreground text-sm text-wrap'>
                            Book a room for a meeting or group discussions.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href='equipment rental'>
                          <div className='font-medium'>Equipment rental</div>
                          <p className='text-muted-foreground text-sm text-wrap'>
                            Rent 3D printers, projectors and more.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href='/admin/clients/form'>
                          <div className='font-medium'>Clients</div>
                          <p className='text-muted-foreground text-sm text-wrap'>
                            Client creation
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href='/auth'>
                          <div className='font-medium'>Auth</div>
                          <p className='text-muted-foreground text-sm text-wrap'>
                            Authentication
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <User2Icon />
      </div>
    </nav>
  )
}
