import { asFunction, asValue, AwilixContainer } from 'awilix'
import { Cradle, diContainer } from 'fastify-awilix/lib/classic'
import { Env } from './app.config'
import { defaultUserServices, UserServices } from '../user/user.service'
import { defaultUserRepository, UserCollection, UserRepository } from '../user/user.repository'
import { MongoClient } from 'mongodb'
import { defaultMongoConfig } from './mongo.config'

export type DiConfig = (env: Env, di: AwilixContainer<Cradle>) => void
declare module 'fastify-awilix' {
  interface Cradle {
    readonly config: Env
    readonly connection: MongoClient
    readonly userRepository: UserRepository
    readonly userCollection: UserCollection
    readonly userServices: UserServices
  }
}

const defaultConfig: DiConfig = async (env, di) => {
  const connection = await defaultMongoConfig(env.db_url)

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
