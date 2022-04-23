/* eslint-disable functional/prefer-tacit */
/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { AwilixContainer, createContainer, InjectionMode } from 'awilix'
import fp from 'fastify-plugin'
import { FastifyPluginCallback } from 'fastify'
import { logger } from '../logger.config'

export interface Cradle {}

export const diContainer = createContainer<Cradle>({
  injectionMode: InjectionMode.CLASSIC,
})

declare module 'fastify' {
  interface FastifyRequest {
    diScope: AwilixContainer<Cradle>
  }

  interface FastifyInstance {
    diContainer: AwilixContainer<Cradle>
  }
}

const fastifyAwilix: FastifyPluginCallback = (fastify, options, done) => {
  fastify.decorate('diContainer', diContainer)

  fastify.addHook('onRequest', (request, reply, done) => {
    // eslint-disable-next-line functional/immutable-data
    request.diScope = diContainer.createScope()
    done()
  })

  fastify.addHook('onResponse', (request, reply, done) => {
    request.diScope
      .dispose()
      .then(() => done())
      .catch((e) => logger.error(e))
  })

  fastify.addHook('onClose', (instance, done) => {
    diContainer
      .dispose()
      .then(() => done())
      .catch((e) => logger.error(e))
  })

  done()
}

export default fp(fastifyAwilix)
