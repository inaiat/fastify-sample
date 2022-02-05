import { DiConfig } from 'config/di.config'
import Fastify, { FastifyPluginAsync } from 'fastify'
import AutoLoad from 'fastify-autoload'
import { diContainer } from 'fastify-awilix/lib/classic'
import fp from 'fastify-plugin'
import { join } from 'path'

async function config() {
  return {}
}

function build(diConfig: DiConfig, route: FastifyPluginAsync) {
  const app = Fastify()

  diConfig({ development: true, PORT: 3000 }, diContainer)

  beforeAll(async () => {
    void app.register(
      fp(async (fastify, opts): Promise<void> => {
        fastify.register(AutoLoad, {
          dir: join(__dirname, '../src/config/plugins'),
          options: opts,
        })

        fastify.register(route)
      }),
      await config()
    )
    await app.ready()
  })

  afterAll(() => app.close())

  return app
}

export { config, build }
