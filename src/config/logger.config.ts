import { FastifyBaseLogger, FastifyLoggerOptions, FastifyServerOptions } from 'fastify'
import pino from 'pino'
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

export const logger = pino(serverOptions.logger) as FastifyBaseLogger
