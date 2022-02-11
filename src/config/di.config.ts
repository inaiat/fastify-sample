import { asFunction, asValue, AwilixContainer } from 'awilix'
import { Cradle, diContainer } from 'fastify-awilix/lib/classic'
import { Env } from './app.config'
import * as mongoose from 'mongoose'
import { User, UserSchema } from '../user/user.model'
import { defaultUserServices, UserServices } from '../user/user.service'
import { defaultUserRepository, UserRepository } from '../user/user.repository'

export type DiConfig = (env: Env, di: AwilixContainer<Cradle>) => void
declare module 'fastify-awilix' {
  interface Cradle {
    readonly config: Env
    readonly connection: mongoose.Connection
    readonly userRepository: UserRepository
    readonly userCollection: mongoose.Model<User>
    readonly userServices: UserServices
  }
}

const createCollection = <T>(
  connection: mongoose.Connection,
  collectionName: string,
  model: mongoose.Model<T>
): mongoose.Model<T> => connection.model(collectionName, model.schema)

const defaultConfig: DiConfig = (env, di) => {
  const connection = mongoose.createConnection(env.db_url)
  di.register({
    config: asValue(env),
    connection: asValue(connection),
    userRepository: asFunction(defaultUserRepository).singleton(),
    userCollection: asValue(createCollection(connection, 'User', UserSchema)),
    userServices: asFunction(defaultUserServices).singleton(),
  })
  return di.cradle
}

export const startContainer = (env: Env): void => defaultConfig(env, diContainer)
