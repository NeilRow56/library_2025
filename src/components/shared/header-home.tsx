import React from 'react'
import Logo from './logo'
import SearchBar from './search-bar'

export default function HomeHeader() {
  return (
    <>
      <header className='container mx-auto px-2 py-2 lg:py-4'>
        {/* mobile */}
        <div className='flex flex-col justify-between p-2 sm:hidden'>
          {/* logo */}
          <div className='flex items-center'>
            <Logo />
          </div>
          <SearchBar />
        </div>
        {/* desktop */}
        <div className='hidden items-center justify-between sm:flex'>
          {/* logo */}

          <Logo />

          <SearchBar />
        </div>
      </header>
    </>
  )
}
