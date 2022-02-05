import { FastifyServerOptions } from 'fastify'
import pino, { LoggerOptions } from 'pino'
import { nanoid } from 'nanoid'

const xRequestId = 'x-request-id'

export type CustomServerOptions = {
  logger: LoggerOptions
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

export const logger = pino(serverOptions.logger)
