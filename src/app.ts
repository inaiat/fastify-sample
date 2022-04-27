import fastify, { FastifyInstance } from 'fastify'
import { ResultAsync } from 'neverthrow'
import { join } from 'path'
import { appConfig } from './config/app.config'
import { exceptionHandler } from './config/error.handler'
import { App } from './config/fastify.config'
import { serverOptions } from './config/logger.config'

const fastifyInstance: FastifyInstance = fastify(serverOptions)
fastifyInstance.register(App, { dir: join(__dirname, './config/plugins') })

const start = async () => {
  const server = async () => {
    fastifyInstance.log.info('Starting server...')
    await fastifyInstance.listen(appConfig().PORT, appConfig().development ? '127.0.0.1' : '0.0.0.0')
  }

  const result = ResultAsync.fromPromise(server(), exceptionHandler).match(
    () => true,
    (err) => {
      fastifyInstance.log.error(err.throwable)
      return false
    }
  )

  if (!result) {
    process.exit(1)
  }
}

start()
