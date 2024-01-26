import { pusherServer } from '@/lib/pusher'
import Chat from '@/models/chat.model'
import Message from '@/models/message.model'
import User from '@/models/user.model'
import { connectToDB } from '@/utils/mongodb'

export async function POST(req: Request) {
  try {
    await connectToDB()

    const body = await req.json()

    const { chatId, currentUserId, text, photo } = body

    const currentUser = await User.findById(currentUserId)

    const newMessage = await Message.create({
      chat: chatId,
      sender: currentUser,
      text,
      photo,
      seenBy: currentUserId,
    })

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: newMessage._id },
        $set: { lastMessageAt: newMessage.createdAt },
      },
      { new: true },
    )
      .populate({
        path: 'messages',
        model: Message,
        populate: { path: 'sender seenBy', model: 'User' },
      })
      .populate({
        path: 'members',
        model: 'User',
      })
      .exec()

    // trigger a pusher event for a specific chat about the new message
    await pusherServer.trigger(chatId, 'new-message', newMessage)

    // triggers a pusher event for each member of the chat about the chat update with the latest message
    const lastMessage = updatedChat.messages[updatedChat.messages.length - 1]

    updatedChat.members.forEach(async (member: any) => {
      try {
        await pusherServer.trigger(member._id.toString(), 'update-chat', {
          id: chatId,
          messages: [lastMessage],
        })
      } catch (error) {
        console.error('Failed to trigger update-chat event')
      }
    })

    return new Response(JSON.stringify(newMessage), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Failed to create a new message', { status: 500 })
  }
}
