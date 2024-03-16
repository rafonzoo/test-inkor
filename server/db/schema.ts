import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { pgTable, serial, text, uniqueIndex, integer } from 'drizzle-orm/pg-core'

export const UsersTable = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    token: text('token').notNull(),
    image: text('image').notNull(),
    memberno: integer('memberno').notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex('unique_idx').on(users.email),
    }
  }
)

export const PaymentTable = pgTable(
  'payments',
  {
    id: serial('id').primaryKey(),
    memberno: integer('memberno').notNull(),
    amount: integer('amount').notNull(),
  },
  (payments) => {
    return {
      uniqueIdx: uniqueIndex('unique_idx').on(payments.memberno),
    }
  }
)

export type User = InferSelectModel<typeof UsersTable>
export type NewUser = InferInsertModel<typeof UsersTable>

export type Payment = InferSelectModel<typeof PaymentTable>
export type NewPayment = InferInsertModel<typeof PaymentTable>
