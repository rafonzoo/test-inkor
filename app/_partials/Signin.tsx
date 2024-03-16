'use client'

import { updateSessionAction } from '@/server/actions'
import { useFormState, useFormStatus } from 'react-dom'

const SubmitButton = () => {
  const { pending } = useFormStatus()

  return (
    <input
      aria-disabled={pending}
      type='submit'
      value={!pending ? 'Continue' : 'Simulate "Auth Service"...'}
      disabled={pending}
      className='h-11 w-full justify-center flex items-center rounded-lg bg-blue-600 text-white px-3 disabled:opacity-40'
    />
  )
}

export const Signin = () => {
  const [{ session, message }, formAction] = useFormState(updateSessionAction, {
    session: null,
    message: '',
  })

  return (
    <>
      <p className='font-bold text-4xl text-center'>Welcome</p>
      <form className='flex items-center flex-col space-y-2' action={formAction}>
        <p className='text-center mt-4 w-full'>Enter email address to continue:</p>
        {message &&
          (session ? (
            <p className='text-sm tracking-normal py-2 rounded bg-green-50 border border-green-600 text-green-800 w-full px-3'>
              {message}
            </p>
          ) : (
            <p className='text-sm tracking-normal py-2 rounded bg-red-50 border border-red-600 text-red-700 w-full px-3'>
              {message}
            </p>
          ))}
        <input
          type='text'
          name='email'
          autoComplete='email'
          className='w-full mt-2 border rounded-lg border-zinc-300 h-11 flex items-center px-3 focus:outline-blue-600 disabled:opacity-40'
          placeholder='Example: abc@mail.com'
          required
        />
        <SubmitButton />
      </form>
    </>
  )
}

export default Signin
