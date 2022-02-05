import fastify, { FastifyInstance } from 'fastify'
import { appConfig, resolveServerAddress } from './config/app.config'
import { startContainer } from './config/di.config'
import { App } from './config/fastify.config'
import { serverOptions } from './config/logger.config'

const server: FastifyInstance = fastify(serverOptions)
server.register(App)

const start = async () => {
  try {
    server.log.info('Starting server...')
    const config = appConfig()
    startContainer(config)
    await server.listen(config.PORT, resolveServerAddress(config.development))
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
