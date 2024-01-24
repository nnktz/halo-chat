import User from '@/models/user.model'
import { connectToDB } from '@/utils/mongodb'

export async function POST(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectToDB()

    const { userId } = params

    const body = await req.json()

    const { username, profileImage } = body

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        profileImage,
      },
      { new: true },
    )

    return new Response(JSON.stringify(updatedUser), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Failed to update user', { status: 500 })
  }
}
