import Fastify from 'fastify'
import { ResultAsync } from 'neverthrow'
import { appConfig } from './config/app.config.js'
import { exceptionHandler } from './plugins/error.handler.js'
import pluginLoader, { serverOptions } from './config/fastify.config.js'
import { exit } from 'node:process'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

const server = Fastify(serverOptions).withTypeProvider<TypeBoxTypeProvider>()
void server.register(pluginLoader)

server.log.info('Starting server...')
const { PORT, development } = appConfig()
await ResultAsync.fromPromise(
  server.listen({ port: PORT, host: development ? '127.0.0.1' : '0.0.0.0' }),
  exceptionHandler
).match(
  (v) => server.log.debug(v),
  (err) => {
    server.log.error(err)
    exit(1)
  }
)
