'use client'

import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { RadioButtonUnchecked } from '@mui/icons-material'
import { CustomSession } from '@/types/next-auth'

import { Loader } from './loader'

export const Contacts = () => {
  const { data: session } = useSession()

  const currentUser = session?.user

  const [loading, setLoading] = useState(true)
  const [contacts, setContacts] = useState<CustomSession[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const getContacts = async () => {
      try {
        const res = await fetch(
          search !== '' ? `/api/users/search-contact/${search}` : '/api/users',
        )
        const data: CustomSession[] = await res.json()
        setContacts(data.filter((contact) => contact.id !== currentUser?.id))
        setLoading(false)
      } catch (error) {
        console.error(error)
      }
    }

    if (currentUser) {
      getContacts()
    }
  }, [currentUser, search])

  if (loading) {
    return <Loader />
  }

  return (
    <div className="create-chat-container text-black">
      <input
        type="text"
        placeholder="Search contact..."
        className="input-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="contact-bar">
        <div className="contact-list">
          <p className="text-body-bold">Select or Deselect</p>
          {contacts.length > 0 &&
            contacts.map((user) => (
              <div key={user.id} className="contact">
                <RadioButtonUnchecked />

                <Image
                  src={user.profileImage || '/assets/images/person.jpg'}
                  alt="user image"
                  width={44}
                  height={44}
                  className="profile-photo"
                />

                <p className="text-base-bold">{user.username}</p>
              </div>
            ))}

          {contacts.length === 0 && (
            <p className="text-center text-base-bold">No any users match</p>
          )}
        </div>

        <div className="create-chat">
          <button className="btn uppercase">Start a new chat</button>
        </div>
      </div>
    </div>
  )
}
