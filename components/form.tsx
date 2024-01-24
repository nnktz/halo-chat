'use client'

import Image from 'next/image'
import Link from 'next/link'
import { EmailOutlined, LockOutlined, PersonOutline } from '@mui/icons-material'
import { FieldValues, useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'

type Props = {
  type: 'register' | 'login'
}

export const Form = ({ type }: Props) => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: any) => {
    if (type === 'register') {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        toast.success('Registration successfully')
        router.push('/login')
      }

      if (!res.ok) {
        toast.error('Something went wrong!')
      }
    }

    if (type === 'login') {
      const res = await signIn('credentials', {
        ...data,
        redirect: false,
      })

      if (res?.ok) {
        toast.success('Login successfully')
        router.push('/chats')
      }

      if (res?.error) {
        toast.error('Invalid email or password!')
      }
    }
  }

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

        <form action="" onSubmit={handleSubmit(onSubmit)} className="form text-black">
          {type === 'register' && (
            <div>
              <div className="input">
                <input
                  type="text"
                  placeholder="Username"
                  className="input-field"
                  {...register('username', {
                    required: 'Username is required',
                    validate: (value) => {
                      if (value.length < 3) {
                        return 'Username must be at least 3 characters'
                      }
                    },
                  })}
                />
                <PersonOutline sx={{ color: '#737373' }} />
              </div>

              <ErrorMessage
                errors={errors}
                name="username"
                render={({ message }) => <p className="ml-2 mt-2 text-red-500">{message}</p>}
              />
            </div>
          )}

          <div>
            <div className="input">
              <input
                type="email"
                placeholder="Email"
                className="input-field"
                {...register('email', { required: 'Email is required' })}
              />
              <EmailOutlined sx={{ color: '#737373' }} />
            </div>

            <ErrorMessage
              errors={errors}
              name="email"
              render={({ message }) => <p className="ml-2 mt-2 text-red-500">{message}</p>}
            />
          </div>

          <div>
            <div className="input">
              <input
                type="password"
                placeholder="Password"
                className="input-field"
                {...register('password', {
                  required: 'Password is required',
                  validate: (value) => {
                    if (value.length < 5) {
                      return 'Password must be at least 5 characters'
                    }

                    if (type === 'register' && !value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)) {
                      return 'Password must be contain at least 1 special character'
                    }
                  },
                })}
              />
              <LockOutlined sx={{ color: '#737373' }} />
            </div>

            <ErrorMessage
              errors={errors}
              name="password"
              render={({ message }) => <p className="ml-2 mt-2 text-red-500">{message}</p>}
            />
          </div>

          <button disabled={isSubmitting} className="button select-none" type="submit">
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
