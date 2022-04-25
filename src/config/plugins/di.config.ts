import fp from 'fastify-plugin'
import { appConfig, Env } from '../app.config'
import { asFunction, asValue } from 'awilix'
import { defaultMongoConfig } from '../mongo.config'
import { MongoClient } from 'mongodb'
import { defaultUserRepository, UserCollection, UserRepository } from '../../user/user.repository'
import { defaultUserServices, UserServices } from '../../user/user.service'
import { diContainer, fastifyAwilixPlugin } from 'fastify-awilix/lib/classic'

declare module 'fastify-awilix' {
  interface Cradle {
    readonly config: Env
    readonly connection: MongoClient
    readonly userRepository: UserRepository
    readonly userCollection: UserCollection
    readonly userServices: UserServices
  }
}

export default fp(async (fastify) => {
  fastify.register(fastifyAwilixPlugin, { disposeOnClose: true, disposeOnResponse: false })
  const env = appConfig()
  const connection = await defaultMongoConfig(env.DB_URL, env.DB_NAME)
  diContainer.register({
    config: asValue(env),
    connection: asValue(connection.client),
    userRepository: asFunction(defaultUserRepository).singleton(),
    userCollection: asValue(connection.userModel),
    userServices: asFunction(defaultUserServices).singleton(),
  })
})
