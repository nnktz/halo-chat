import Image from 'next/image'
import Link from 'next/link'
import { EmailOutlined, LockOutlined, PersonOutline } from '@mui/icons-material'

type Props = {
  type: 'register' | 'login'
}

export const Form = ({ type }: Props) => {
  return (
    <div className="auth">
      <div className="content">
        <Image
          src={'/assets/images/logo.png'}
          alt="logo"
          width={208}
          height={100}
          className="logo select-none"
        />

        <form action="" className="form text-black">
          {type === 'register' && (
            <div className="input">
              <input type="text" placeholder="Username" className="input-field" />
              <PersonOutline sx={{ color: '#737373' }} />
            </div>
          )}

          <div className="input">
            <input type="email" placeholder="Email" className="input-field" />
            <EmailOutlined sx={{ color: '#737373' }} />
          </div>

          <div className="input">
            <input type="password" placeholder="Password" className="input-field" />
            <LockOutlined sx={{ color: '#737373' }} />
          </div>

          <button className="button select-none" type="submit">
            {type === 'register' ? 'Join Free' : "Let's Chat"}
          </button>
        </form>

        {type === 'register' ? (
          <p className="text-center text-black">
            Already have an account?{' '}
            <Link href={'/login'} className="link">
              Sign in here
            </Link>
          </p>
        ) : (
          <p className="text-center text-black">
            Don&apos;t have an account?{' '}
            <Link href={'/register'} className="link">
              Sign in here
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
