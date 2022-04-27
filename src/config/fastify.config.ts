import { FastifyPluginAsync } from 'fastify'
import AutoLoad, { AutoloadPluginOptions } from 'fastify-autoload'
import { Result } from 'neverthrow'
import { BaseError } from './error.handler'
import { logger } from './logger.config'

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
