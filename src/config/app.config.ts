import { Static, Type } from '@sinclair/typebox'
import envSchema from 'env-schema'

const schema = Type.Strict(
  Type.Object({
    PORT: Type.Number({ default: 3000 }),
    development: Type.Boolean({ default: false }),
    db_url: Type.String({ default: 'mongodb://localhost:27017' }),
  })
)

export type Env = Static<typeof schema>

export const resolveServerAddress = (development: boolean) => (development ? undefined : '0.0.0.0')

export const appConfig = (): Env => {
  return envSchema<Env>({
    dotenv: true,
    schema: schema,
  })
}
