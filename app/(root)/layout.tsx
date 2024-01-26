import { BottomBar } from '@/components/bottom-bar'
import { TopBar } from '@/components/top-bar'

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className="min-h-screen bg-blue-2">
      <TopBar />
      {children}
      <BottomBar />
    </div>
  )
}

export default Layout
