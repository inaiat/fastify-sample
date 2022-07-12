import Fastify from 'fastify'
import { ResultAsync } from 'neverthrow'
import { appConfig } from './config/app.config.js'
import { exceptionHandler } from './config/error.handler.js'
import { serverOptions } from './config/fastify.config.js'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { exit } from 'node:process'
import fastifyAutoload from '@fastify/autoload'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

const server = Fastify(serverOptions).withTypeProvider<TypeBoxTypeProvider>()
void server.register(async (fastify, opts) => {
  await fastify.register(fastifyAutoload, {
    dir: join(dirname(fileURLToPath(import.meta.url)), './plugins'),
    options: opts,
    forceESM: true,
  })
})

server.log.info('Starting server...')
const { PORT, development } = appConfig()
const result = await ResultAsync.fromPromise(
  server.listen({ port: PORT, host: development ? '127.0.0.1' : '0.0.0.0' }),
  exceptionHandler
).match(
  () => true,
  (err) => {
    server.log.error(err)
    return false
  }
)
if (!result) {
  exit(1)
}
