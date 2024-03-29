import Chat from '@/models/chat.model'
import Message from '@/models/message.model'
import User from '@/models/user.model'
import { connectToDB } from '@/utils/mongodb'

export async function GET(req: Request, { params }: { params: { chatId: string } }) {
  try {
    await connectToDB()

    const { chatId } = params

    const chat = await Chat.findById(chatId)
      .populate({ path: 'members', model: User })
      .populate({
        path: 'messages',
        model: Message,
        populate: { path: 'sender seenBy', model: User },
      })
      .exec()

    return new Response(JSON.stringify(chat), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Failed to get chat details', { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { chatId: string } }) {
  try {
    await connectToDB()

    const { chatId } = params

    const body = await req.json()

    const { currentUserId } = body

    await Message.updateMany({ chat: chatId }, { $addToSet: { seenBy: currentUserId } })
      .populate({
        path: 'sender seenBy',
        model: User,
      })
      .exec()

    return new Response('Seen all messages by current user', { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Failed to get chat details', { status: 500 })
  }
}
