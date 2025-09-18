import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Logo() {
  return (
    <Link href='/'>
      <Image
        className='hidden lg:flex'
        src='/images/logo.svg'
        alt='logo'
        width={48}
        height={48}
      />
      <Image
        className='flex lg:hidden'
        src='/images/logo.svg'
        alt='logo'
        width={36}
        height={36}
      />
    </Link>
  )
}
