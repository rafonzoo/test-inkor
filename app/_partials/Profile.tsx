import { getPaymentAction, getUserAction } from '@/server/actions'
import { FC, Suspense } from 'react'
import Signout from '@/app/_partials/Signout'

const Payment: FC<{ memberNo: number }> = async ({ memberNo }) => {
  const payment = await getPaymentAction(memberNo)
  const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  })

  return (
    <div className='text-sm tracking-normal'>
      <hr className='my-4' />
      <div>
        <div className='flex justify-between'>
          <p>Member number:</p>
          <p>
            <strong>{memberNo}</strong>
          </p>
        </div>
      </div>
      <div>
        <div className='flex justify-between'>
          <p>Amount:</p>
          <p>
            <strong>{currency.format(payment.amount)}</strong>
          </p>
        </div>
      </div>
      <div className='text-center mt-20'>
        <p>Not quite enough for you?</p>
        <p>
          <a href='tel:+6281310728754' className='text-blue-600'>
            We can talk :)
          </a>
        </p>
      </div>
    </div>
  )
}

const Profile: FC<{ token: string; email: string }> = async (payload) => {
  const user = await getUserAction(payload)
  return (
    <div className='mt-4'>
      <div className='flex space-x-3 p-3 bg-blue-50 rounded-xl'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.image}
          alt='User image'
          width={45.5}
          className='rounded-full'
        />
        <div>
          <p className='capitalize'>Howdy, {user.name}!</p>
          <Signout email={user.email} />
        </div>
      </div>
      <div className='text-sm tracking-normal mt-4'>
        <div className='flex justify-between'>
          <p>Email address:</p>
          <p>
            <strong>{user.email}</strong>
          </p>
        </div>
        <div className='flex justify-between'>
          <p>Display name:</p>
          <p className='capitalize'>
            <strong>{user.name}</strong>
          </p>
        </div>
      </div>
      <Suspense
        fallback={
          <div className='text-center mt-6 text-sm tracking-normal text-zinc-500'>
            <p>Simulate {'"Posts Service"'}</p>
            <p>Loading...</p>
          </div>
        }
      >
        <Payment memberNo={user.memberno} />
      </Suspense>
    </div>
  )
}

export default Profile
