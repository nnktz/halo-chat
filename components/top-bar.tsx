'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Logout } from '@mui/icons-material'
import { signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'

export const TopBar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  const user = session?.user

  const chatsHref = '/chats'
  const contactsHref = '/contacts'

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="top-bar">
      <Link href={'/chats'}>
        <Image
          src={'/assets/images/logo.png'}
          alt="logo"
          width={208}
          height={100}
          className="logo"
        />
      </Link>

      <div className="menu text-black">
        <Link
          href={chatsHref}
          className={`${pathname === chatsHref && 'text-red-1'} text-heading4-bold`}
        >
          Chats
        </Link>

        <Link
          href={contactsHref}
          className={`${pathname === contactsHref && 'text-red-1'} text-heading4-bold`}
        >
          Contacts
        </Link>

        <div className="cursor-pointer" onClick={handleLogout}>
          <Logout sx={{ color: '#737373' }} />
        </div>

        <Image
          role="button"
          src={user?.profileImage || '/assets/images/person.jpg'}
          alt="user image"
          height={44}
          width={44}
          className="profile-photo"
          onClick={() => router.push('/profile')}
        />
      </div>
    </div>
  )
}
