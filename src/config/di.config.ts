import { asFunction, asValue, AwilixContainer } from 'awilix'
import { Env } from './app.config'
import { defaultUserServices, UserServices } from '../user/user.service'
import { defaultUserRepository, UserCollection, UserRepository } from '../user/user.repository'
import { MongoClient } from 'mongodb'
import { defaultMongoConfig } from './mongo.config'
import { Cradle, diContainer } from './plugins/fastify-awilix'

declare module './plugins/fastify-awilix' {
  interface Cradle {
    readonly config: Env
    readonly connection: MongoClient
    readonly userRepository: UserRepository
    readonly userCollection: UserCollection
    readonly userServices: UserServices
  }
}

export type DiConfig = (env: Env, di: AwilixContainer<Cradle>) => void

const defaultConfig: DiConfig = async (env, di) => {
  const connection = await defaultMongoConfig(env.DB_URL, env.DB_NAME)

  di.register({
    config: asValue(env),
    connection: asValue(connection.client),
    userRepository: asFunction(defaultUserRepository).singleton(),
    userCollection: asValue(connection.userModel),
    userServices: asFunction(defaultUserServices).singleton(),
  })
  return di.cradle
}

export const startContainer = async (env: Env) => defaultConfig(env, diContainer)
