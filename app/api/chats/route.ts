import Chat from '@/models/chat.model'
import User from '@/models/user.model'
import { connectToDB } from '@/utils/mongodb'

export async function POST(req: Request) {
  try {
    await connectToDB()

    const body = await req.json()

    const { currentUserId, members, isGroup, name, groupPhoto } = body

    // Define 'query' to find the chat
    const query = isGroup
      ? { isGroup, name, groupPhoto, members: [currentUserId, ...members] }
      : { members: { $all: [currentUserId, ...members], $size: 2 } }

    let chat = await Chat.findOne(query)

    if (!chat) {
      chat = await new Chat(isGroup ? query : { members: [currentUserId, ...members] })

      await chat.save()

      const updatedAllMembers = chat.members.map(async (memberId: string) => {
        await User.findByIdAndUpdate(
          memberId,
          {
            $addToSet: {
              chats: chat._id,
            },
          },
          { new: true },
        )
      })

      Promise.all(updatedAllMembers)
    }

    return new Response(JSON.stringify(chat), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Failed to create a new chat', { status: 500 })
  }
}
