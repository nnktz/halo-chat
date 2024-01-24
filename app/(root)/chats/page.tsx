'use client'

import { useSession } from 'next-auth/react'

const ChatsPage = () => {
  const { data: session } = useSession()

  console.log(session)

  return <div className=""></div>
}

export default ChatsPage
