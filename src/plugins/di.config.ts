import fp from 'fastify-plugin'
import { appConfig, Env } from '../config/app.config.js'
import { asFunction, asValue } from 'awilix'
import { defaultUserRepository, UserRepository } from '../user/user.repository.js'
import { defaultUserServices, UserServices } from '../user/user.service.js'
import { FastifyPluginAsync } from 'fastify'
import { diContainer, fastifyAwilixPlugin } from '@fastify/awilix/lib/classic/index.js'
import { UserModel } from './papr.js'

declare module '@fastify/awilix' {
  interface Cradle {
    readonly config: Env
    readonly userRepository: UserRepository
    readonly userModel: UserModel
    readonly userServices: UserServices
  }
}

export default fp<FastifyPluginAsync>(
  async (fastify) => {
    void diContainer.register({
      config: asValue(appConfig()),
      userRepository: asFunction(defaultUserRepository).singleton(),
      userModel: asValue(fastify.papr.user),
      userServices: asFunction(defaultUserServices).singleton(),
    })

    await fastify.register(fastifyAwilixPlugin, {
      disposeOnClose: true,
      disposeOnResponse: false,
    })
  },
  { name: 'di.config', dependencies: ['papr'] }
)
