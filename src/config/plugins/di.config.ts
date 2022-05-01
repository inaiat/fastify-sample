import fp from 'fastify-plugin'
import { appConfig, Env } from '../app.config'
import { asFunction, asValue } from 'awilix'
import { MongoClient } from 'mongodb'
import { defaultUserRepository, UserCollection, UserRepository } from '../../user/user.repository'
import { defaultUserServices, UserServices } from '../../user/user.service'
import { FastifyPluginAsync } from 'fastify'
import { userModel } from './mongo.papr'
import { FastifyAwilix } from '@inaiat/fastify-awilix-plugin'

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
    const container = new FastifyAwilix(fastify, 'CLASSIC')
    container.register({
      config: asValue(appConfig()),
      connection: asValue(fastify.mongo),
      userRepository: asFunction(defaultUserRepository).singleton(),
      userCollection: asValue(userModel),
      userServices: asFunction(defaultUserServices).singleton(),
    })
  },
  { name: 'di.config' }
)
