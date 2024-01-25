import Chat from '@/models/chat.model'
import User from '@/models/user.model'
import { connectToDB } from '@/utils/mongodb'

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectToDB()

    const { userId } = params

    const allChats = await Chat.find({ members: userId })
      .sort({ lastMessage: -1 })
      .populate({ path: 'members', model: User })
      .exec()

    return new Response(JSON.stringify(allChats), { status: 200 })
  } catch (error) {
    console.error(error)

    return new Response('Failed to get all chats of current user', { status: 500 })
  }
}
