import fastify, { FastifyInstance } from 'fastify'
import { ResultAsync } from 'neverthrow'
import { appConfig } from './config/app.config'
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
    await fastifyInstance.listen(config.PORT, config.development ? '127.0.0.1' : '0.0.0.0')
  }

  const result = await ResultAsync.fromPromise(server(), ExceptionHandler)

  if (result.isErr()) {
    fastifyInstance.log.error(result.error.throwable)
    process.exit(1)
  }
}

start()
