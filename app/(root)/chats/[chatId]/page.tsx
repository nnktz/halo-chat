'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

import { ChatDetails } from '@/components/chat-details'
import { ChatList } from '@/components/chat-list'

const ChatIdPage = ({ params }: { params: { chatId: string } }) => {
  const { data: session } = useSession()

  const currentUser = session?.user
  const { chatId } = params

  useEffect(() => {
    const seenMessages = async () => {
      try {
        await fetch(`/api/chats/${chatId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentUserId: currentUser?.id,
          }),
        })
      } catch (error) {
        console.error(error)
      }
    }

    if (currentUser && chatId) {
      seenMessages()
    }
  }, [chatId, currentUser])

  return (
    <div className="main-container">
      <div className="w-1/3 max-lg:hidden">
        <ChatList currentChatId={chatId} />
      </div>

      <div className="w-2/3 max-lg:w-full">
        <ChatDetails chatId={chatId} currentUser={currentUser} />
      </div>
    </div>
  )
}

export default ChatIdPage
