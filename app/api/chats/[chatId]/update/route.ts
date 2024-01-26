import Chat from '@/models/chat.model'
import { connectToDB } from '@/utils/mongodb'

export async function POST(req: Request, { params }: { params: { chatId: string } }) {
  try {
    await connectToDB()

    const body = await req.json()

    const { chatId } = params

    const { name, groupPhoto } = body

    const updatedGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      { name, groupPhoto },
      { new: true },
    )

    return new Response(JSON.stringify(updatedGroupChat), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Failed to update group chat info', { status: 500 })
  }
}
