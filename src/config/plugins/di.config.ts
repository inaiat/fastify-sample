import fp from 'fastify-plugin'
import { appConfig, Env } from '../app.config'
import { asFunction, asValue } from 'awilix'
import { defaultMongoConfig } from '../mongo.config'
import { MongoClient } from 'mongodb'
import { defaultUserRepository, UserCollection, UserRepository } from '../../user/user.repository'
import { defaultUserServices, UserServices } from '../../user/user.service'
import { diContainer, fastifyAwilixPlugin } from 'fastify-awilix/lib/classic'
import { FastifyPluginAsync } from 'fastify'
import { logger } from '../logger.config'

declare module 'fastify-awilix' {
  interface Cradle {
    readonly config: Env
    readonly connection: MongoClient
    readonly userRepository: UserRepository
    readonly userCollection: UserCollection
    readonly userServices: UserServices
  }
}

const diPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(fastifyAwilixPlugin, { disposeOnClose: true, disposeOnResponse: false })
  const env = appConfig()
  const connection = await defaultMongoConfig(env.DB_URL, env.DB_NAME)
  if (connection.isOk()) {
    diContainer.register({
      config: asValue(env),
      connection: asValue(connection.value.connection),
      userRepository: asFunction(defaultUserRepository).singleton(),
      userCollection: asValue(connection.value.userModel),
      userServices: asFunction(defaultUserServices).singleton(),
    })
  } else {
    logger.error(connection.error, 'Error on mongo startup')
  }
}

export default fp(diPlugin)
