import fp from 'fastify-plugin'
import { appConfig, Env } from '../app.config'
import { asFunction, asValue } from 'awilix'
import { MongoClient } from 'mongodb'
import { defaultUserRepository, UserCollection, UserRepository } from '../../user/user.repository'
import { defaultUserServices, UserServices } from '../../user/user.service'
import { FastifyPluginAsync } from 'fastify'
import { fastifyAwilixPlugin } from '@inaiat/fastify-awilix-plugin'
import { userModel } from './mongo.papr'

declare module '@inaiat/fastify-awilix-plugin' {
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
    const env = appConfig()
    fastify.register(fastifyAwilixPlugin, {
      module: {
        config: asValue(env),
        connection: asValue(fastify.mongo),
        userRepository: asFunction(defaultUserRepository).singleton(),
        userCollection: asValue(userModel),
        userServices: asFunction(defaultUserServices).singleton(),
      },
      injectionMode: 'CLASSIC',
    })
  },
  { name: 'di.config' }
)
