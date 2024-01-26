'use client'

import Image from 'next/image'
import toast from 'react-hot-toast'
import { ErrorMessage } from '@hookform/error-message'
import { PersonOutline } from '@mui/icons-material'
import { useSession } from 'next-auth/react'
import { CldUploadButton, CldUploadWidgetResults } from 'next-cloudinary'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'

import { Loader } from '@/components/loader'

const ProfilePage = () => {
  const router = useRouter()
  const { data: session } = useSession()

  const user = session?.user

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      reset({
        username: user?.username,
        profileImage: user?.profileImage,
      })
    }
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const {
    register,
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      username: user?.username,
      profileImage: user?.profileImage,
    },
  })

  const onUpload = (result: CldUploadWidgetResults) => {
    if (typeof result?.info === 'object' && result.info !== null) {
      setValue('profileImage', result.info.secure_url)
    } else {
      toast.error('Something went wrong!')
    }
  }

  const onSubmit = async (data: any) => {
    setLoading(true)

    try {
      const res = await fetch(`/api/users/${user?.id}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).finally(() => {
        setLoading(false)
      })

      if (res.ok) {
        router.refresh()
        toast.success('Updated successfully!')
      }

      if (!res.ok) {
        toast.error('Something went wrong!')
      }
    } catch (error) {
      toast.error('Something went wrong!')
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="profile-page">
      <h1 className="text-heading3-bold capitalize text-black">Edit your profile</h1>

      <form action="" onSubmit={handleSubmit(onSubmit)} className="edit-profile text-black">
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
          render={({ message }) => <p className="text-red-500">{message}</p>}
        />

        <div className="flex items-center justify-between">
          <Image
            src={watch('profileImage') || user?.profileImage || '/assets/images/person.jpg'}
            alt="user image"
            width={160}
            height={160}
            className="h-40 rounded-full"
          />

          <CldUploadButton options={{ maxFiles: 1 }} onUpload={onUpload} uploadPreset="tou93xzt">
            <p className="text-body-bold hover:text-blue-500">Upload new photo</p>
          </CldUploadButton>
        </div>

        <button disabled={loading} className="btn" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default ProfilePage
