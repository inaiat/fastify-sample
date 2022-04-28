import { Cradle, fastifyAwilixPlugin } from '@inaiat/fastify-awilix-plugin'
import { NameAndRegistrationPair } from 'awilix'
import Fastify from 'fastify'
import { AutoloadPluginOptions } from 'fastify-autoload'
import fp from 'fastify-plugin'
import { join } from 'path'
import { App } from '../src/config/fastify.config'

async function config() : Promise<AutoloadPluginOptions> {
  return { dir: join(__dirname, '../src/config/plugins'), ignorePattern: /di\.config/ }
}

function build(diConfig: NameAndRegistrationPair<Cradle>) {
  const app = Fastify()

  app.register(fastifyAwilixPlugin, { module: diConfig,
    injectionMode: 'CLASSIC' })

  beforeAll(async () => {
    void app.register(fp(App), await config())
    await app.ready()
  })

  afterAll(() => app.close())

  return app
}

export { config, build }
