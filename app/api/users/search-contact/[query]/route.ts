import User from '@/models/user.model'
import { connectToDB } from '@/utils/mongodb'

export async function GET(req: Request, { params }: { params: { query: string } }) {
  try {
    await connectToDB()

    const { query } = params

    const searchedContacts = await User.find({
      $or: [
        {
          username: {
            $regex: query,
            $options: 'i',
          },
          email: {
            $regex: query,
            $options: 'i',
          },
        },
      ],
    })

    return new Response(JSON.stringify(searchedContacts), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Failed to search contact', { status: 500 })
  }
}
