'use client'

import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

type Props = {
  session?: Session
}

const Provider = ({ children, session }: React.PropsWithChildren<Props>) => {
  return <SessionProvider session={session}>{children}</SessionProvider>
}

export default Provider
