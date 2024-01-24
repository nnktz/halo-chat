import { DefaultUser } from 'next-auth'

interface CustomSession extends DefaultUser {
  id: string
}

declare module 'next-auth' {
  interface Session {
    user: CustomSession
  }
}
