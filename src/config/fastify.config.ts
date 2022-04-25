import { FastifyPluginAsync } from 'fastify'
import AutoLoad, { AutoloadPluginOptions } from 'fastify-autoload'
import { Result } from 'neverthrow'
import { join } from 'path'
import { BaseError } from './error.handler'

export const App: FastifyPluginAsync<AutoloadPluginOptions> = async (fastify, opts): Promise<void> => {
  fastify.register(AutoLoad, {
    dir: join(__dirname, './plugins'),
    ignorePattern: opts.ignorePattern,
    options: opts,
  })

  fastify.register(AutoLoad, {
    dir: join(__dirname, '../routes'),
    options: opts,
  })
}

export const replyResult = <T>(result: Result<T, BaseError>) => {
  if (result.isOk()) {
    return result.value
  } else {
    return result.error.throwable
  }
}
