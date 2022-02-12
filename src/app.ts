import fastify, { FastifyInstance } from 'fastify'
import { ResultAsync } from 'neverthrow'
import { appConfig, resolveServerAddress } from './config/app.config'
import { startContainer } from './config/di.config'
import { ExceptionHandler } from './config/error.handler'
import { App } from './config/fastify.config'
import { serverOptions } from './config/logger.config'

const fastifyInstance: FastifyInstance = fastify(serverOptions)
fastifyInstance.register(App)

const start = async () => {
  const server = async () => {
    fastifyInstance.log.info('Starting server...')
    const config = appConfig()
    await startContainer(config)
    await fastifyInstance.listen(config.PORT, resolveServerAddress(config.development))
  }

  const result = await ResultAsync.fromPromise(server(), ExceptionHandler)

  if (result.isErr()) {
    fastifyInstance.log.error(result.error.throwable)
    process.exit(1)
  }
}

start()
