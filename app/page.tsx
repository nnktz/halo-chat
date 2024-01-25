'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

const HomePage = () => {
  const { data: session } = useSession()

  if (!session) {
    redirect('/login')
  }

  return redirect('/chats')
}

export default HomePage
