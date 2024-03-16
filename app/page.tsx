import { db } from '@/server/db/drizzle'
import { PaymentTable, UsersTable } from '@/server/db/schema'
import { seedPayments, seedUsers } from '@/server/db/seed'
import { getSessionAction } from '@/server/actions'
import { Suspense } from 'react'
import Profile from '@/app/_partials/Profile'
import Signin from '@/app/_partials/Signin'

export default async function Home() {
  const session = await getSessionAction()

  // Seeding "users"
  try {
    await db.select().from(UsersTable)
  } catch (e: any) {
    if (e.message === `relation "users" does not exist`) {
      await seedUsers()
    }
  }

  // Seeding "payments"
  try {
    await db.select().from(PaymentTable)
  } catch (e: any) {
    if (e.message === `relation "payments" does not exist`) {
      await seedPayments()
    }
  }

  return (
    <main>
      <div className='max-w-[372px] mx-auto'>
        {!session ? (
          <Signin />
        ) : (
          <>
            <p className='font-bold text-4xl text-center'>Payment</p>
            <Suspense
              fallback={
                <div className='text-center mt-6 text-zinc-500'>
                  <p>Simulate {'"Users Service"'}</p>
                  <p>Loading...</p>
                </div>
              }
            >
              <Profile token={session.token} email={session.email} />
            </Suspense>
          </>
        )}
      </div>
      <div className='fixed w-full bottom-0 left-0'>
        <div className='max-w-[372px] w-[87.5%] mx-auto mb-6 text-xs tracking-wide text-zinc-500 text-center'>
          This is reactjs problem test as of Frontend Engineer role and intended to
          PT. Cyber Edu Inkor. All right reserved.
        </div>
      </div>
    </main>
  )
}
