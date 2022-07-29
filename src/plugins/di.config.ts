import fp from 'fastify-plugin'
import { appConfig, Env } from '../config/app.config.js'
import { asFunction, asValue } from 'awilix'
import { defaultUserServices, UserServices } from '../user/user.service.js'
import { FastifyPluginAsync } from 'fastify'
import { diContainer, fastifyAwilixPlugin } from '@fastify/awilix/lib/classic/index.js'
import { Prisma, PrismaClient } from '@prisma/client'

export type UserModel = Prisma.UserDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>

declare module '@fastify/awilix' {
  interface Cradle {
    readonly config: Env
    readonly prismaClient: PrismaClient
    readonly userCollection: UserModel
    readonly userServices: UserServices
  }
}

export default fp<FastifyPluginAsync>(
  async (fastify) => {
    void diContainer.register({
      config: asValue(appConfig()),
      prismaClient: asValue(fastify.prisma),
      userCollection: asValue(fastify.prisma.user),
      userServices: asFunction(defaultUserServices).singleton(),
    })

    await fastify.register(fastifyAwilixPlugin, {
      disposeOnClose: true,
      disposeOnResponse: false,
    })
  },
  { name: 'di.config', dependencies: ['prisma'] }
)
