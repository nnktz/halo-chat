import Chat from '@/models/chat.model'
import Message from '@/models/message.model'
import { connectToDB } from '@/utils/mongodb'

export async function POST(req: Request) {
  try {
    await connectToDB()

    const body = await req.json()

    const { chatId, currentUserId, text, photo } = body

    const newMessage = await Message.create({
      chat: chatId,
      sender: currentUserId,
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

    return new Response(JSON.stringify(newMessage), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Failed to create a new message', { status: 500 })
  }
}
