import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'

import { connectToDB } from '@/utils/mongodb'
import User from '@/models/user.model'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials) {
          if (!credentials.email || !credentials.password) {
            throw new Error('Please enter your email or password')
          }

          await connectToDB()

          const user = await User.findOne({ email: credentials.email })

          if (!user || !user?.password) {
            throw new Error('Invalid email or password')
          }

          const isMatch = await compare(credentials.password, user.password)

          if (!isMatch) {
            throw new Error('Invalid password')
          }

          return user
        }
      },
    }),
  ],
})

export { handler as GET, handler as POST }
