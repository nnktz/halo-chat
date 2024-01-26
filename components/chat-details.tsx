'use client'

import { type CustomSession } from '@/types/next-auth'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AddPhotoAlternate } from '@mui/icons-material'
import toast from 'react-hot-toast'
import { CldUploadButton, type CldUploadWidgetResults } from 'next-cloudinary'

import { pusherClient } from '@/lib/pusher'

import { Loader } from './loader'
import { MessageBox } from './message-box'

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
  const [isSending, setIsSending] = useState(false)

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

  const sendText = async () => {
    if (text.trim() === '') {
      return toast('Please enter a text!')
    }

    setIsSending(true)

    try {
      const res = await fetch(`/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId, currentUserId: currentUser?.id, text: text.trim() }),
      }).finally(() => setIsSending(false))

      if (res.ok) {
        setText('')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again!')
    }
  }

  const sendPhoto = async (result: CldUploadWidgetResults) => {
    let photoUrl

    if (typeof result?.info === 'object' && result.info !== null) {
      photoUrl = result.info.secure_url

      try {
        const res = await fetch(`/api/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chatId, currentUserId: currentUser?.id, photo: photoUrl }),
        })
      } catch (error) {
        toast.error('Something went wrong. Please try again!')
      }
    } else {
      toast.error('Something went wrong!')
    }
  }

  useEffect(() => {
    pusherClient.subscribe(chatId)

    const handleMessage = async (newMessage: any) => {
      setChat((prevChat: any) => {
        return {
          ...prevChat,
          messages: [...prevChat.messages, newMessage],
        }
      })
    }

    pusherClient.bind('new-message', handleMessage)

    return () => {
      pusherClient.unsubscribe(chatId)
      pusherClient.unbind('new-message', handleMessage)
    }
  }, [chatId])

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [chat?.messages])

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

      <div className="chat-body">
        {chat?.messages?.map((message: any, index: number) => (
          <MessageBox key={index} message={message} currentUser={currentUser} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="send-message">
        <div className="prepare-message">
          <CldUploadButton options={{ maxFiles: 1 }} onUpload={sendPhoto} uploadPreset="tou93xzt">
            <AddPhotoAlternate
              sx={{
                fontSize: '35px',
                color: '#737373',
                cursor: 'pointer',
                '&:hover': { color: 'red' },
              }}
            />
          </CldUploadButton>

          <input
            type="text"
            placeholder="Write a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            disabled={isSending}
            className="input-field !w-full"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendText()
              }
            }}
          />
        </div>

        <div role="button" aria-disabled={isSending} className="ml-4" onClick={sendText}>
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
