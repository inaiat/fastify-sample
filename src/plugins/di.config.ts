import fp from 'fastify-plugin'
import { appConfig, Env } from '../config/app.config'
import { asFunction, asValue } from 'awilix'
import { MongoClient } from 'mongodb'
import { defaultUserRepository, UserCollection, UserRepository } from '../user/user.repository'
import { defaultUserServices, UserServices } from '../user/user.service'
import { FastifyPluginAsync } from 'fastify'
import { userModel } from './mongo.papr'
import { diContainer, fastifyAwilixPlugin } from '@fastify/awilix/lib/classic'

declare module '@fastify/awilix' {
  interface Cradle {
    readonly config: Env
    readonly connection: MongoClient
    readonly userRepository: UserRepository
    readonly userCollection: UserCollection
    readonly userServices: UserServices
  }
}

export default fp<FastifyPluginAsync>(
  async (fastify) => {
    void diContainer.register({
      config: asValue(appConfig()),
      connection: asValue(fastify.mongo),
      userRepository: asFunction(defaultUserRepository).singleton(),
      userCollection: asValue(userModel),
      userServices: asFunction(defaultUserServices).singleton(),
    })

    await fastify.register(fastifyAwilixPlugin, {
      disposeOnClose: true,
      disposeOnResponse: false,
    })
  },
  { name: 'di.config' }
)
