import { FastifyPluginAsync } from 'fastify'
import AutoLoad from 'fastify-autoload'
import { join } from 'path'

export const App: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.register(AutoLoad, {
    dir: join(__dirname, './plugins'),
    options: opts,
  })

  fastify.register(AutoLoad, {
    dir: join(__dirname, '../routes'),
    options: opts,
  })
}
