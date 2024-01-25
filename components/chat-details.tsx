'use client'

import { CustomSession } from '@/types/next-auth'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AddPhotoAlternate } from '@mui/icons-material'

import { Loader } from './loader'

export const ChatDetails = ({
  chatId,
  currentUser,
}: {
  chatId: string
  currentUser?: CustomSession
}) => {
  const [loading, setLoading] = useState(true)
  const [chat, setChat] = useState<any>({})
  const [otherMembers, setOtherMembers] = useState<any[]>([])
  const [text, setText] = useState('')

  useEffect(() => {
    const getChatDetails = async () => {
      try {
        const res = await fetch(`/api/chats/${chatId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await res.json()
        const otherMembersData = data?.members?.filter(
          (member: any) => member._id !== currentUser?.id,
        )

        setChat(data)
        setOtherMembers(otherMembersData)
        setLoading(false)
      } catch (error) {
        console.error(error)
      }
    }

    if (currentUser && chatId) {
      getChatDetails()
    }
  }, [chatId, currentUser])

  if (loading) {
    return <Loader />
  }

  return (
    <div className="chat-details text-black">
      <div className="chat-header">
        {chat?.isGroup ? (
          <>
            <Link href={`/chats/${chatId}/group-info`}>
              <Image
                src={chat?.groupPhoto || '/assets/images/group.png'}
                alt="group image"
                height={44}
                width={44}
                className="profile-photo"
              />
            </Link>

            <div className="text">
              <p>
                {chat?.name} &#160; &#183; &#160; {chat?.members?.length} members
              </p>
            </div>
          </>
        ) : (
          <>
            <Image
              src={otherMembers[0]?.profileImage || '/assets/images/person.jpg'}
              alt="user image"
              height={44}
              width={44}
              className="profile-photo"
            />

            <div className="text">
              <p>
                {otherMembers[0]?.username} &#160; &#183; &#160; {chat?.members?.length} members
              </p>
            </div>
          </>
        )}
      </div>

      <div className="chat-body"></div>

      <div className="send-message">
        <div className="prepare-message">
          <AddPhotoAlternate
            sx={{
              fontSize: '35px',
              color: '#737373',
              cursor: 'pointer',
              '&:hover': { color: 'red' },
            }}
          />

          <input
            type="text"
            placeholder="Write a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="input-field !w-full"
          />
        </div>

        <div className="ml-4">
          <Image
            src={'/assets/images/send.jpg'}
            alt="send image"
            height={40}
            width={40}
            className="send-icon"
          />
        </div>
      </div>
    </div>
  )
}
