'use client'

import { removeSessionAction } from '@/server/actions'
import { useRouter } from 'next/navigation'
import { FC, useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'

const SubmitButton: FC<{ isSignedOut: boolean }> = ({ isSignedOut }) => {
  const { pending } = useFormStatus()

  return (
    <input
      type='submit'
      className='text-sm tracking-normal text-blue-600 text-left disabled:opacity-40'
      disabled={pending || isSignedOut}
      value={
        !pending ? (isSignedOut ? 'A moment...' : 'Sign out?') : 'Signing out...'
      }
    />
  )
}

const Signout: FC<{ email: string }> = ({ email }) => {
  const [{ success }, formAction] = useFormState(removeSessionAction, {
    message: '',
    success: false,
  })

  const router = useRouter()

  useEffect(() => {
    if (success) {
      router.refresh()
    }
  }, [router, success])

  return (
    <form action={formAction} className='flex'>
      <input type='hidden' name='email' value={email} />
      <SubmitButton isSignedOut={success} />
    </form>
  )
}

export const revalidate = 0

export default Signout
