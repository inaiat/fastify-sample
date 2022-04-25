import { FastifyPluginAsync } from 'fastify'
import AutoLoad, { AutoloadPluginOptions } from 'fastify-autoload'
import { Result } from 'neverthrow'
import { BaseError } from './error.handler'

export const App: FastifyPluginAsync<AutoloadPluginOptions> = async (fastify, opts) => fastify.register(AutoLoad, opts)

export const replyResult = <T>(result: Result<T, BaseError>) => {
  if (result.isOk()) {
    return result.value
  } else {
    return result.error.throwable
  }
}
