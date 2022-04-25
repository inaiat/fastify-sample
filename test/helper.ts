import { NameAndRegistrationPair } from 'awilix'
import Fastify from 'fastify'
import { AutoloadPluginOptions } from 'fastify-autoload'
import { Cradle, diContainer, fastifyAwilixPlugin } from 'fastify-awilix/lib/classic'
import fp from 'fastify-plugin'
import { join } from 'path'
import { App } from '../src/config/fastify.config'

async function config() : Promise<AutoloadPluginOptions> {
  return { dir: join(__dirname, '../src/config/plugins'), ignorePattern: /di\.config/ }
}

function build(diConfig: NameAndRegistrationPair<Cradle>) {
  const app = Fastify()

  app.register(fastifyAwilixPlugin, { disposeOnClose: true,
    disposeOnResponse: false })
  diContainer.register(diConfig)

  beforeAll(async () => {
    void app.register(fp(App), await config())
    await app.ready()
  })

  afterAll(() => app.close())

  return app
}

export { config, build }
