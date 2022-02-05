import { FastifyInstance } from 'fastify'
import { FastifyAwilixOptions, fastifyAwilixPlugin } from 'fastify-awilix/lib/classic'
import fp from 'fastify-plugin'

export default fp<FastifyAwilixOptions>(async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    disposeOnResponse: false,
  })
})
