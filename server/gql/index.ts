import { buildSchema } from 'garph'

import { resolvers } from '@/server/gql/resolver'
import { g } from '@/server/gql/schema'

export const schema = buildSchema({ g, resolvers })
