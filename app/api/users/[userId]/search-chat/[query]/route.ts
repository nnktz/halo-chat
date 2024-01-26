import Chat from '@/models/chat.model'
import Message from '@/models/message.model'
import User from '@/models/user.model'
import { connectToDB } from '@/utils/mongodb'

export async function GET(req: Request, { params }: { params: { query: string; userId: string } }) {
  try {
    await connectToDB()

    const { query, userId } = params

    const search = await Chat.find({
      members: userId,
      name: { $regex: query, $options: 'i' },
    })
      .populate({ path: 'members', model: User })
      .populate({
        path: 'messages',
        model: Message,
        populate: { path: 'sender seenBy', model: User },
      })
      .exec()

    return new Response(JSON.stringify(search), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Failed to search chat', { status: 500 })
  }
}
