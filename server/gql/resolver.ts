import { InferResolvers } from 'garph'
import { YogaInitialContext } from 'graphql-yoga'
import { and, eq } from 'drizzle-orm'

import { mutationType, queryType } from '@/server/gql/schema'
import { db } from '@/server/db/drizzle'
import { PaymentTable, UsersTable } from '@/server/db/schema'

type Resolvers = InferResolvers<
  { Query: typeof queryType; Mutation: typeof mutationType },
  { context: YogaInitialContext }
>

export const resolvers: Resolvers = {
  Query: {
    getUsers: () => db.select().from(UsersTable).execute(),

    getUser: async (_, { token, email }) => {
      try {
        const users = await db
          .select()
          .from(UsersTable)
          .where(and(eq(UsersTable.token, token), eq(UsersTable.email, email)))
          .execute()

        if (!users.length) {
          return null
        }

        return users[0]
      } catch (e) {
        return null
      }
    },

    getUserPayment: async (_, { memberno }) => {
      try {
        const payments = await db
          .select()
          .from(PaymentTable)
          .where(eq(PaymentTable.memberno, memberno))
          .execute()

        if (!payments.length) {
          return null
        }

        return payments[0]
      } catch (e) {
        return null
      }
    },

    getSession: async (_, { token }) => {
      try {
        const users = await db
          .select()
          .from(UsersTable)
          .where(eq(UsersTable.token, token))
          .execute()

        if (!users.length) {
          return null
        }

        return users[0]
      } catch (e) {
        return null
      }
    },
  },
  Mutation: {
    updateToken: async (_, { email, token }) => {
      const [user] = await db
        .update(UsersTable)
        .set({ token })
        .where(eq(UsersTable.email, email))
        .returning()
        .execute()

      return user
    },
  },
}
