import { FastifyBaseLogger, FastifyPluginAsync } from 'fastify'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { Result } from 'neverthrow'
import { BaseError } from './error.handler'

import pino from 'pino'
import { FastifyLoggerOptions, FastifyServerOptions } from 'fastify'
import { nanoid } from 'nanoid'
import { ajvTypeBoxPlugin } from '@fastify/type-provider-typebox'

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
  ajv: {
    plugins: [ajvTypeBoxPlugin],
  },
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

export const replyResult = <T>(result: Result<T, BaseError>) => {
  if (result.isOk()) {
    return result.value
  } else {
    return result.error.throwable
  }
}

export const logger = pino(serverOptions.logger) as FastifyBaseLogger
