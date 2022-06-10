import { Cradle, diContainer, fastifyAwilixPlugin } from '@fastify/awilix/lib/classic'
import { NameAndRegistrationPair } from 'awilix'
import Fastify from 'fastify'
import fastifyAutoload, { AutoloadPluginOptions } from '@fastify/autoload'
import { join } from 'path'
import { serverOptions } from '../src/config/fastify.config'

async function config(): Promise<AutoloadPluginOptions> {
  return { dir: join(__dirname, '../src/config/plugins'), ignorePattern: /di\.config/ }
}

function build(diConfig: NameAndRegistrationPair<Cradle>, scriptPattern: string[] = []) {
  const app = Fastify(serverOptions)
  diContainer.register(diConfig)

  beforeAll(async () => {
    app.register(fastifyAwilixPlugin, {
      disposeOnClose: true,
      disposeOnResponse: false,
    })
    app.register(fastifyAutoload, {
      dir: join(__dirname, '../src/routes'),
      scriptPattern: new RegExp(`(${scriptPattern.join('|')})`),
    })

    await app.ready()
  })

  afterAll(() => app.close())

  return app
}

export { config, build }
