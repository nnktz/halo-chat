import { ChatList } from '@/components/chat-list'
import { Contacts } from '@/components/contacts'

const ChatsPage = () => {
  return (
    <div className="main-container">
      <div className="w-1/3 max-lg:w-1/2 max-md:w-full">
        <ChatList />
      </div>

      <div className="w-2/3 max-lg:w-1/2 max-md:hidden">
        <Contacts />
      </div>
    </div>
  )
}

export default ChatsPage
