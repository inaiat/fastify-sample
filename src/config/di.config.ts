import { asFunction, asValue, AwilixContainer } from 'awilix'
import { Cradle, diContainer } from 'fastify-awilix/lib/classic'
import { Env } from './app.config'
import * as mongoose from 'mongoose'
import { User, UserSchema } from '../user/user.model'
import { defaultUserServices } from '../user/user.service'

export type DiConfig = (env: Env, di: AwilixContainer<Cradle>) => void
declare module 'fastify-awilix' {
  interface Cradle {
    config: Env
    connection: Promise<mongoose.Connection>
    userCollection: Promise<mongoose.Model<User>>
    userServices: ReturnType<typeof defaultUserServices>
  }
}

const createConnection = async (dbUrl: string) => mongoose.createConnection(dbUrl)
const createCollection = async <T>(
  connection: Promise<mongoose.Connection>,
  colName: string,
  model: mongoose.Model<T>
): Promise<mongoose.Model<T>> => (await connection).model(colName, model.schema)

const defaultConfig: DiConfig = (env, di) => {
  const connection = createConnection(env.db_url)
  di.register({
    config: asValue(env),
    connection: asValue(connection),
    userCollection: asValue(createCollection(connection, 'User', UserSchema)),
    userServices: asFunction(defaultUserServices).singleton(),
  })
}

export const startContainer = (env: Env): void => {
  defaultConfig(env, diContainer)
}
