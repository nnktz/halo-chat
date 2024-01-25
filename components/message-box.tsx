import { CustomSession } from '@/types/next-auth'
import { format } from 'date-fns'
import Image from 'next/image'

export const MessageBox = ({
  message,
  currentUser,
}: {
  message: any
  currentUser?: CustomSession
}) => {
  return (
    <>
      {message?.sender?._id !== currentUser?.id ? (
        <div className="message-box text-black">
          <Image
            src={message?.sender?.profileImage || '/assets/images/person.jpg'}
            alt="user image"
            width={32}
            height={32}
            className="message-profile-photo"
          />

          <div className="message-info">
            <p className="text-small-bold">
              {message?.sender?.username} &#160; &#183; &#160;{' '}
              {format(new Date(message?.createdAt), 'p')}
            </p>

            {message?.text ? (
              <p className="message-text-sender">{message?.text}</p>
            ) : (
              <Image
                src={message?.photo}
                alt="photo message"
                height={100}
                width={100}
                className="message-photo h-auto w-fit"
              />
            )}
          </div>
        </div>
      ) : (
        <div className="message-box justify-end text-black">
          <div className="message-info items-end">
            <p className="text-small-bold">{format(new Date(message?.createdAt), 'p')}</p>

            {message?.text ? (
              <p className="message-text-sender">{message?.text}</p>
            ) : (
              <Image
                src={message?.photo}
                alt="photo message"
                height={100}
                width={100}
                className="message-photo h-auto w-fit"
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}
