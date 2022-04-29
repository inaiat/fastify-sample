import { FastifyPluginAsync } from 'fastify'
import AutoLoad from 'fastify-autoload'
import fp from 'fastify-plugin'
import { join } from 'path/posix'

export default fp<FastifyPluginAsync>(
  async (fastify, opts) => {
    fastify.register(AutoLoad, {
      dir: join(__dirname, '../../routes'),
      options: opts,
    })
  },
  { name: 'routes', dependencies: ['swagger'] }
)
