'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { pusherClient } from '@/lib/pusher'

import { Loader } from './loader'
import { ChatBox } from './chat-box'

export const ChatList = ({ currentChatId }: { currentChatId?: string }) => {
  const { data: session } = useSession()

  const currenUser = session?.user

  const [loading, setLoading] = useState(true)
  const [chats, setChats] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const getChats = async () => {
      try {
        const res = await fetch(
          search !== ''
            ? `/api/users/${currenUser?.id}/search-chat/${search}`
            : `/api/users/${currenUser?.id}`,
        )

        const data = await res.json()

        setChats(data)
        setLoading(false)
      } catch (error) {
        console.error(error)
      }
    }

    if (currenUser) {
      getChats()
    }
  }, [currenUser, search])

  useEffect(() => {
    if (currenUser) {
      pusherClient.subscribe(currenUser.id)

      const handleChatUpdate = async (updatedChat: any) => {
        setChats((allChats) =>
          allChats.map((chat) => {
            if (chat._id === updatedChat.id) {
              return { ...chat, messages: updatedChat.messages }
            } else {
              return chat
            }
          }),
        )
      }

      const handleNewChat = async (newChat: any) => {
        setChats((allChats) => [...allChats, newChat])
      }

      pusherClient.bind('update-chat', handleChatUpdate)
      pusherClient.bind('new-chat', handleNewChat)

      return () => {
        pusherClient.unsubscribe(currenUser.id)
        pusherClient.unbind('update-chat', handleChatUpdate)
        pusherClient.unbind('new-chat', handleNewChat)
      }
    }
  }, [currenUser])

  console.log(chats)

  if (loading) {
    return <Loader />
  }

  return (
    <div className="chat-list">
      <input
        type="text"
        placeholder="Search chat..."
        className="input-search text-black"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="chats">
        {chats.length > 0 &&
          chats.map((chat, index) => (
            <ChatBox
              key={index}
              chat={chat}
              currentUser={currenUser}
              currentChatId={currentChatId}
            />
          ))}

        {chats.length === 0 && (
          <p className="text-center text-base-bold text-black">No chats found</p>
        )}
      </div>
    </div>
  )
}
