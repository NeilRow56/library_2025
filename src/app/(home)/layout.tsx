import Footer from '@/components/shared/footer'
import HomeHeader from '@/components/shared/header-home'
import { Navbar } from '@/components/shared/navbar'

import React from 'react'

function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className=''>
      <HomeHeader />
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

export default HomeLayout
