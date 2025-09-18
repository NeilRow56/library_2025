import Footer from '@/components/shared/footer'
import HomeHeader from '@/components/shared/header-home'

import React from 'react'

function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <HomeHeader />
      {children}
      <Footer />
    </div>
  )
}

export default HomeLayout
