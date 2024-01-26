'use client'

import Image from 'next/image'
import toast from 'react-hot-toast'
import { ErrorMessage } from '@hookform/error-message'
import { GroupOutlined, PersonOutline } from '@mui/icons-material'
import { CldUploadButton, CldUploadWidgetResults } from 'next-cloudinary'
import { useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { Loader } from '@/components/loader'

const GroupInfoPage = ({ params }: { params: { chatId: string } }) => {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [chat, setChat] = useState<any>({})

  const { chatId } = params

  const {
    register,
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>()

  useEffect(() => {
    const getChatDetails = async () => {
      try {
        const res = await fetch(`/api/chats/${chatId}`)
        const data = await res.json()

        setChat(data)
        setLoading(false)
        reset({
          name: data?.name,
          groupPhoto: data?.groupPhoto,
        })
      } catch (error) {
        console.error(error)
      }
    }

    if (chatId) {
      getChatDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId])

  const onUpload = (result: CldUploadWidgetResults) => {
    if (typeof result?.info === 'object' && result.info !== null) {
      setValue('groupPhoto', result.info.secure_url)
    } else {
      toast.error('Something went wrong!')
    }
  }

  const onSubmit = async (data: any) => {
    setLoading(true)

    try {
      const res = await fetch(`/api/chats/${chatId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).finally(() => {
        setLoading(false)
      })

      console.log(data)

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
      <h1 className="text-heading3-bold capitalize text-black">Edit group info</h1>

      <form action="" onSubmit={handleSubmit(onSubmit)} className="edit-profile text-black">
        <div className="input">
          <input
            type="text"
            placeholder="Group chat name"
            className="input-field"
            {...register('name', {
              required: 'Group chat name is required',
            })}
          />
          <GroupOutlined sx={{ color: '#737373' }} />
        </div>

        <ErrorMessage
          errors={errors}
          name="name"
          render={({ message }) => <p className="text-red-500">{message}</p>}
        />

        <div className="flex items-center justify-between">
          <Image
            src={watch('groupPhoto') || chat?.groupPhoto || '/assets/images/group.png'}
            alt="group chat image"
            width={160}
            height={160}
            className="h-40 rounded-full"
          />

          <CldUploadButton options={{ maxFiles: 1 }} onUpload={onUpload} uploadPreset="tou93xzt">
            <p className="text-body-bold hover:text-blue-500">Upload new photo</p>
          </CldUploadButton>
        </div>

        <div className="flex flex-wrap gap-3">
          {chat?.members?.map((member: any, index: number) => (
            <p className="selected-contact" key={index}>
              {member.username}
            </p>
          ))}
        </div>

        <button disabled={loading} className="btn" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default GroupInfoPage
