import Fastify from 'fastify'
import fp from 'fastify-plugin'
import { diContainer } from 'fastify-awilix/lib/classic'
import { DiConfig } from '../src/config/di.config'
import { App } from '../src/config/fastify.config'

async function config() {
  return {}
}

function build(diConfig: DiConfig) {
  const app = Fastify()

  diConfig({ development: true, db_url: 'mongodb', PORT: 3000 }, diContainer)

  beforeAll(async () => {
    void app.register(fp(App), await config())
    await app.ready()
  })

  afterAll(() => app.close())

  return app
}

export { config, build }
