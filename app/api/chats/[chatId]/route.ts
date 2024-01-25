import Chat from '@/models/chat.model'
import User from '@/models/user.model'
import { connectToDB } from '@/utils/mongodb'

export async function GET(req: Request, { params }: { params: { chatId: string } }) {
  try {
    await connectToDB()

    const { chatId } = params

    const chat = await Chat.findById(chatId).populate({ path: 'members', model: User }).exec()

    return new Response(JSON.stringify(chat), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Failed to get chat details', { status: 200 })
  }
}
