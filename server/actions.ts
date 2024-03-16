'use server'

import { request, gql } from 'graphql-request'
import { Infer } from 'garph'
import { UserGQL } from '@/server/gql/schema'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export const getSessionAction = async () => {
  // Simulate
  await new Promise((res) => setTimeout(res, 1_000))

  const url = process.env.NEXT_PUBLIC_SITE_URL + '/api/graphql'
  const cookieStore = cookies()

  if (cookieStore.has('_token')) {
    const token = cookieStore.get('_token')?.value
    const { getSession: session } = await request<{
      getSession: Pick<Infer<typeof UserGQL>, 'email' | 'token'>
    }>(
      url,
      gql`
        query getSession($token: String!) {
          getSession(token: $token) {
            email
            token
          }
        }
      `,
      {
        token,
      }
    )

    if (session) {
      return {
        token: session.token,
        email: session.email,
      }
    }
  }

  return null
}

// Example using "Server Action" which is relatively new in reactjs,
// even it can be solved with using route handler.
export const updateSessionAction = async (_: any, formData: FormData) => {
  const url = process.env.NEXT_PUBLIC_SITE_URL + '/api/graphql'
  const email = formData.get('email')

  // Simulate
  await new Promise((res) => setTimeout(res, 1_000))

  try {
    const { getUsers } = await request<{ getUsers: Array<Infer<typeof UserGQL>> }>(
      url,
      gql`
        query getUsers {
          getUsers {
            email
          }
        }
      `
    )

    const current = getUsers.find((user) => user.email === email)

    if (!current) {
      throw new Error('Invalid email address')
    }

    const token: string = require('crypto').randomBytes(32).toString('hex')
    const { updateToken } = await request<{ updateToken: Infer<typeof UserGQL> }>(
      url,
      gql`
        mutation updateToken($email: String!, $token: String!) {
          updateToken(email: $email, token: $token) {
            email
            name
            token
          }
        }
      `,
      {
        email: current.email,
        token,
      }
    )

    // i. Each client has to get token from Auth Service using graph ql, return token 32 bytes
    // -- INPUT [POST] { email: string }
    // -- OUTPUT { token, email, expired: 600 }
    const maxAge = 60 * 10 // 10 min
    const session = {
      token: updateToken.token,
      email: current.email,
      expired: maxAge,
    }

    cookies().set('_token', session.token, { path: '/', maxAge })
    revalidatePath('/')

    return { session, message: `Authenticated as ${current.email}` }
  } catch (e) {
    return {
      session: null,
      message: (e as Error).message,
    }
  }
}

export const removeSessionAction = async (_: any, formData: FormData) => {
  const url = process.env.NEXT_PUBLIC_SITE_URL + '/api/graphql'
  const email = formData.get('email')

  try {
    await request<{ updateToken: Infer<typeof UserGQL> }>(
      url,
      gql`
        mutation updateToken($email: String!, $token: String!) {
          updateToken(email: $email, token: $token) {
            id
          }
        }
      `,
      {
        email,
        token: '',
      }
    )

    cookies().delete('_token')
    revalidatePath('/')

    return {
      message: 'You has been logged out.',
      success: true,
    }
  } catch (e) {
    return { message: (e as Error).message, success: false }
  }
}

export const getUserAction = async ({
  token,
  email,
}: {
  token: string
  email: string
}) => {
  const url = process.env.NEXT_PUBLIC_SITE_URL + '/api/graphql'

  // Simulate
  await new Promise((res) => setTimeout(res, 1_000))
  const { getUser: user } = await request<{
    getUser: Omit<Infer<typeof UserGQL>, 'id' | '__typename'>
  }>(
    url,
    gql`
      query getUser($token: String!, $email: String!) {
        getUser(token: $token, email: $email) {
          email
          name
          token
          image
          memberno
        }
      }
    `,

    // ii. User service json must be
    // -- INPUT [POST] { tokenId: <32 bytes string>, email: abc@mail.com }
    // -- OUTPUT { name : john, memberNo: 12345 }
    {
      token,
      email,
    }
  )

  return user
}

export const getPaymentAction = async (memberno: number) => {
  const url = process.env.NEXT_PUBLIC_SITE_URL + '/api/graphql'

  // Simulate
  await new Promise((res) => setTimeout(res, 1_000))
  const { getUserPayment: payment } = await request<{
    getUserPayment: { [X in 'memberno' | 'amount']: number }
  }>(
    url,
    gql`
      query getUserPayment($memberno: Int!) {
        getUserPayment(memberno: $memberno) {
          memberno
          amount
        }
      }
    `,
    // iii. Please access Payment in Post Services with must be:
    // -- INPUT [POST] { memberNo: 12345 }
    // -- OUTPUT { memberNo: 12345, amount: 500000.00 }
    {
      memberno,
    }
  )

  return payment
}
