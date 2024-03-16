import { GarphSchema } from 'garph'

export const g = new GarphSchema()

export const UserGQL = g.type('User', {
  id: g.int(),
  email: g.string(),
  name: g.string(),
  token: g.string(),
  image: g.string(),
  memberno: g.int(),
})

export const PaymentGQL = g.type('Payment', {
  id: g.int(),
  memberno: g.int(),
  amount: g.int(),
})

export const queryType = g.type('Query', {
  getUsers: g.ref(UserGQL).list().description('Gets an array of user'),
  getUser: g
    .ref(UserGQL)
    .optional()
    .args({ token: g.string(), email: g.string() })
    .description('Get current user'),
  getUserPayment: g
    .ref(PaymentGQL)
    .optional()
    .args({ memberno: g.int() })
    .description('Get user payment'),
  getSession: g
    .ref(UserGQL)
    .optional()
    .args({ token: g.string() })
    .description('Get current session'),
})

export const mutationType = g.type('Mutation', {
  updateToken: g
    .ref(UserGQL)
    .args({
      email: g.string(),
      token: g.string(),
    })
    .description('Update user token'),
})
