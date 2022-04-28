import fp from 'fastify-plugin'
import { appConfig, Env } from '../app.config'
import { asFunction, asValue } from 'awilix'
import { defaultMongoConfig } from '../mongo.config'
import { MongoClient } from 'mongodb'
import { defaultUserRepository, UserCollection, UserRepository } from '../../user/user.repository'
import { defaultUserServices, UserServices } from '../../user/user.service'
import { FastifyPluginAsync } from 'fastify'
import { logger } from '../logger.config'
import { fastifyAwilixPlugin } from '@inaiat/fastify-awilix-plugin'

declare module '@inaiat/fastify-awilix-plugin' {
  interface Cradle {
    readonly config: Env
    readonly connection: MongoClient
    readonly userRepository: UserRepository
    readonly userCollection: UserCollection
    readonly userServices: UserServices
  }
}

export default fp<FastifyPluginAsync>(async (fastify) => {
  const env = appConfig()
  const connection = await defaultMongoConfig(env.DB_URL, env.DB_NAME)
  connection.match(
    (v) => {
      fastify.register(fastifyAwilixPlugin, {
        module: {
          config: asValue(env),
          connection: asValue(v.connection),
          userRepository: asFunction(defaultUserRepository).singleton(),
          userCollection: asValue(v.userModel),
          userServices: asFunction(defaultUserServices).singleton(),
        },
        injectionMode: 'CLASSIC',
      })
    },
    (e) => logger.error(e, 'Error on mongo startup')
  )
})
