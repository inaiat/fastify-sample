import Fastify, { FastifyInstance } from 'fastify'
import { ResultAsync } from 'neverthrow'
import { join } from 'path'
import { appConfig } from './config/app.config'
import { exceptionHandler } from './config/error.handler'
import { App, serverOptions } from './config/fastify.config'

const fastify: FastifyInstance = Fastify(serverOptions)
fastify.register(App, { dir: join(__dirname, './plugins') })

const start = async () => {
  const server = async () => {
    fastify.log.info('Starting server...')
    await fastify.listen({ port: appConfig().PORT, host: appConfig().development ? '127.0.0.1' : '0.0.0.0' })
  }

  const result = ResultAsync.fromPromise(server(), exceptionHandler).match(
    () => true,
    (err) => {
      fastify.log.error(err.throwable)
      return false
    }
  )

  if (!result) {
    process.exit(1)
  }
}

start()
