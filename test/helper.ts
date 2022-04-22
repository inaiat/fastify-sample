import Fastify from 'fastify'
import fp from 'fastify-plugin'
import { diContainer } from 'fastify-awilix/lib/classic'
import { DiConfig } from '../src/config/di.config'
import { App } from '../src/config/fastify.config'
import { mock } from 'strong-mock'

async function config() {
  return {}
}

function build(diConfig: DiConfig) {
  const app = Fastify()

  diConfig(mock(), diContainer)

  beforeAll(async () => {
    void app.register(fp(App), await config())
    await app.ready()
  })

  afterAll(() => app.close())

  return app
}

export { config, build }
