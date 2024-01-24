import { DefaultUser } from 'next-auth'

interface CustomSession extends DefaultUser {
  id: string
  username: string
  profileImage?: string
}

declare module 'next-auth' {
  interface Session {
    user: CustomSession
  }
}
