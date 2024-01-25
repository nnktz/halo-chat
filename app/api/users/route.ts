import User from '@/models/user.model'
import { connectToDB } from '@/utils/mongodb'

export async function GET(req: Request, res: Response) {
  try {
    await connectToDB()

    const allUsers = await User.find()

    return new Response(JSON.stringify(allUsers), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Failed to get all users', { status: 500 })
  }
}
