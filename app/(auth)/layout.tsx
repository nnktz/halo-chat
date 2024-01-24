import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Auth Halo Chat',
  description: 'Build a Next 14 Chat App',
}

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <div className="bg-purple-1">{children}</div>
}

export default AuthLayout
