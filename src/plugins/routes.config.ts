import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { join } from 'node:path/posix'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import fastifyAutoload from '@fastify/autoload'

export default fp<FastifyPluginAsync>(
  async (fastify, opts) => {
    await fastify.register(fastifyAutoload, {
      dir: join(dirname(fileURLToPath(import.meta.url)), '../routes'),
      options: opts,
      forceESM: true,
    })
  },
  { dependencies: ['swagger'] }
)
