'use client'

import Image from 'next/image'
import { CustomSession } from '@/types/next-auth'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

type ChatBoxProps = {
  chat: any
  currentUser: CustomSession
}

export const ChatBox = ({ chat, currentUser }: ChatBoxProps) => {
  const router = useRouter()

  const otherMembers = chat?.members?.filter((member: any) => member._id !== currentUser.id)

  const lastMessage = chat?.messages?.length > 0 && chat?.messages[chat?.messages.length - 1]

  return (
    <div className="chat-box" onClick={() => router.push(`/chats/${chat._id}`)}>
      <div className="chat-info text-black">
        {chat?.isGroup ? (
          <Image
            src={chat?.groupPhoto || '/assets/images/group.png'}
            alt="group image"
            width={44}
            height={44}
            className="profile-photo"
          />
        ) : (
          <Image
            src={otherMembers[0].profilePhoto || '/assets/images/person.jpg'}
            alt="user image"
            width={44}
            height={44}
            className="profile-photo"
          />
        )}

        <div className="flex flex-col gap-1">
          {chat?.isGroup ? (
            <p className="text-base-bold">{chat?.name}</p>
          ) : (
            <p className="text-base-bold">{otherMembers[0]?.username}</p>
          )}

          {!lastMessage && <p className="text-small-bold text-gray-600">Start a chat</p>}
        </div>
      </div>

      <div>
        <p className="text-base-light text-grey-3">
          {!lastMessage && format(new Date(chat?.createdAt), 'p')}
        </p>
      </div>
    </div>
  )
}
