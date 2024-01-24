import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

import './globals.css'
import Provider from '@/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Halo Chat',
  description: 'Build a Next 14 Chat App',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <Toaster />
          {children}
        </Provider>
      </body>
    </html>
  )
}
