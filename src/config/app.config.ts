import { Static, Type } from '@sinclair/typebox'
import envSchema from 'env-schema'

const schema = Type.Strict(
  Type.Object({
    PORT: Type.Number({ default: 3000 }),
    development: Type.Boolean({ default: false }),
    DB_NAME: Type.String({ default: 'User' }),
    DB_URL: Type.String({ default: 'mongodb://localhost:27017' }),
  })
)

export type Env = Static<typeof schema>

export const appConfig = (): Env => {
  return envSchema<Env>({
    dotenv: true,
    schema: schema,
  })
}
