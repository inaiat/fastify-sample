import { FastifyBaseLogger, FastifyPluginAsync } from 'fastify'
import { fastifyAutoload } from '@fastify/autoload'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pino from 'pino'
import { FastifyLoggerOptions, FastifyServerOptions } from 'fastify'
import { nanoid } from 'nanoid'

const xRequestId = 'x-request-id'

export type CustomServerOptions = {
  readonly logger: FastifyLoggerOptions
} & Partial<FastifyServerOptions>

const formatter = {
  level(level: string) {
    return { level }
  },
}

export const serverOptions: CustomServerOptions = {
  genReqId: (req) => {
    const serverReqId = req.headers[xRequestId] as string | undefined
    if (serverReqId) return serverReqId
    return nanoid()
  },
  logger: {
    level: 'info',
    formatters: formatter,
  },
}

export const logger = pino(serverOptions.logger) as FastifyBaseLogger

const pluginLoader: FastifyPluginAsync = async (fastify, opts) => {
  void fastify
    .register(fastifyAutoload, {
      dir: join(dirname(fileURLToPath(import.meta.url)), '../plugins'),
      forceESM: true,
      options: opts,
    })
    .after((e) => {
      if (e === null) {
        logger.info('All plugins loaded successfuly')
      } else {
        logger.error(e, 'Error on loading plugin(s)')
        // If app didn't load all plugins correctly an exception must be throw and app must be break
        // eslint-disable-next-line functional/no-throw-statement
        throw e
      }
    })
}

export default pluginLoader
