'use client'

import Image from 'next/image'
import { CustomSession } from '@/types/next-auth'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

type ChatBoxProps = {
  chat: any
  currentUser?: CustomSession
  currentChatId?: string
}

export const ChatBox = ({ chat, currentUser, currentChatId }: ChatBoxProps) => {
  const router = useRouter()

  const otherMembers = chat?.members?.filter((member: any) => member._id !== currentUser?.id)

  const lastMessage = chat?.messages?.length > 0 && chat?.messages[chat?.messages.length - 1]

  const seen = lastMessage?.seenBy?.find((member: any) => member._id === currentUser?.id)

  return (
    <div
      className={`chat-box ${chat._id === currentChatId && 'bg-blue-2'}`}
      onClick={() => router.push(`/chats/${chat._id}`)}
    >
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

          {lastMessage?.photo ? (
            lastMessage?.sender?._id === currentUser?.id ? (
              <p className="text-small-medium text-grey-3">You sent a photo</p>
            ) : (
              <p className={`${seen ? 'text-small-medium text-grey-3' : 'text-small-bold'}`}>
                Received a photo
              </p>
            )
          ) : (
            <p
              className={`last-message ${seen ? 'text-small-medium text-grey-3' : 'text-small-bold'}`}
            >
              {lastMessage?.text}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-base-light text-grey-3">
          {!lastMessage
            ? format(new Date(chat?.createdAt), 'p')
            : format(new Date(chat?.lastMessageAt), 'p')}
        </p>
      </div>
    </div>
  )
}
