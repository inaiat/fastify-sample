import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import FastifySwagger from '@fastify/swagger'

export default fp<FastifyPluginAsync>(
  async (fastify): Promise<void> => {
    fastify.register(FastifySwagger, {
      exposeRoute: true,
      routePrefix: '/docs',
      openapi: {
        info: {
          title: 'Fastify sample server',
          description: 'Fastify sample api',
          version: '0.1.0',
        },
      },
    })
  },
  { name: 'swagger' }
)
