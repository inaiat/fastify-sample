import { FastifyBaseLogger, FastifyPluginAsync } from 'fastify'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'

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

export const App: FastifyPluginAsync<AutoloadPluginOptions> = async (fastify, opts) => {
  fastify
    .register(AutoLoad, opts)
    .after((e) =>
      e === null ? logger.info('All plugins loaded successfuly') : logger.error(e, 'Error on loading plugin(s)')
    )
}

export const logger = pino(serverOptions.logger) as FastifyBaseLogger
