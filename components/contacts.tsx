'use client'

import Image from 'next/image'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

import { Loader } from './loader'

export const Contacts = () => {
  const router = useRouter()
  const { data: session } = useSession()

  const currentUser = session?.user

  const [loading, setLoading] = useState(true)
  const [contacts, setContacts] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const getContacts = async () => {
      try {
        const res = await fetch(
          search !== '' ? `/api/users/search-contact/${search}` : '/api/users',
        )

        const data: any[] = await res.json()

        const contactFilter = data.filter((contact) => contact._id !== currentUser?.id)

        setContacts(contactFilter)

        setLoading(false)
      } catch (error) {
        console.error(error)
      }
    }

    if (currentUser) {
      getContacts()
    }
  }, [currentUser, search])

  const [selectedContacts, setSelectedContacts] = useState<any[]>([])
  const isGroup = selectedContacts.length > 1

  const handleSelect = (contact: any) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts((prevSelectedContacts) =>
        prevSelectedContacts.filter((item) => item !== contact),
      )
    } else {
      setSelectedContacts((prevSelectedContacts) => [...prevSelectedContacts, contact])
    }
  }

  const [name, setName] = useState('')

  const createChat = async () => {
    if (isGroup && name === '') {
      return toast.error('Please enter a name for this chat')
    }

    const res = await fetch('/api/chats/', {
      method: 'POST',
      body: JSON.stringify({
        currentUserId: currentUser?.id,
        members: selectedContacts.map((contact) => contact._id),
        isGroup,
        name,
      }),
    })

    const chat = await res.json()

    if (res.ok) {
      toast.success('Created chat!')
      router.push(`/chats/${chat._id}`)
    }
  }

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
            contacts.map((user, index) => (
              <div key={index} className="contact" onClick={() => handleSelect(user)}>
                {selectedContacts.find((item) => item === user) ? (
                  <CheckCircle sx={{ color: 'red' }} />
                ) : (
                  <RadioButtonUnchecked />
                )}

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
          {isGroup && (
            <>
              <div className="flex flex-col gap-3">
                <p className="text-body-bold">Group chat name</p>

                <input
                  type="text"
                  placeholder="Enter group chat name..."
                  className="input-group-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-body-bold">Members</p>

                <div className="flex flex-wrap gap-3">
                  {selectedContacts.map((contact, index) => (
                    <p key={index} className="selected-contact">
                      {contact.username}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            disabled={selectedContacts.length === 0}
            onClick={createChat}
            className="btn uppercase"
          >
            Start a new chat
          </button>
        </div>
      </div>
    </div>
  )
}
