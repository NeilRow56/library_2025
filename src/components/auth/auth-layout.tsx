'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import LoginForm from './login-form'
import { RegisterForm } from './register-form'

function AuthLayout() {
  const [activeTab, setActiveTab] = useState('login')

  return (
    <div className='flex min-h-[80vh] items-center justify-center'>
      <div className='bg-card w-full max-w-md rounded-lg border p-5 shadow-sm'>
        {/* <h1 className="text-2xl font-bold text-center mb-6">Welcome!</h1> */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='mb-4 grid w-full grid-cols-2'>
            <TabsTrigger value='login'>Login</TabsTrigger>
            <TabsTrigger value='register'>Register</TabsTrigger>
          </TabsList>
          <TabsContent value='login'>
            <LoginForm />
          </TabsContent>
          <TabsContent value='register'>
            <RegisterForm onSuccess={() => setActiveTab('login')} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AuthLayout
