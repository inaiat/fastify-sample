import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import FastifySwagger from 'fastify-swagger'

export default fp<FastifyInstance>(async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(FastifySwagger, {
    exposeRoute: true,
    routePrefix: '/swagger',
    swagger: {
      info: {
        title: 'Fastify swagger',
        description: 'Fastify swagger API',
        version: '0.1.0',
      },
      schemes: ['http'],
    },
  })
})
