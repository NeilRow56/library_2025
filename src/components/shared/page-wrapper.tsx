import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { SidebarTrigger } from './ui/sidebar'

import { Fragment } from 'react'
import { ModeToggle } from './mode-toggle'

import { SignOutButton } from './sign-out-button'

interface PageWrapperProps {
  children: React.ReactNode
  breadcrumbs: {
    label: string
    href: string
  }[]
}

export function PageWrapper({ children, breadcrumbs }: PageWrapperProps) {
  return (
    <div className='flex flex-col gap-4'>
      <header className='flex items-center border-b p-4'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-4'>
            <SidebarTrigger />

            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                  <Fragment key={breadcrumb.label}>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={breadcrumb.href}>
                        {breadcrumb.label}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index !== breadcrumbs.length - 1 && (
                      <BreadcrumbSeparator />
                    )}
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className='flex items-center gap-4'>
            <ModeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>{children}</div>
    </div>
  )
}
