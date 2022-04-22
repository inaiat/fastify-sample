import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import FastifySwagger from 'fastify-swagger'

export default fp<FastifyInstance>(async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(FastifySwagger, {
    exposeRoute: true,
    routePrefix: '/docs',
    openapi: {
      info: {
        title: 'User Open api',
        version: '0.0.1',
      },
    },
  })
})
