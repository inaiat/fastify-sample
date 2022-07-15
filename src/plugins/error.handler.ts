import fp from 'fastify-plugin'
import { FastifyPluginAsync, FastifyReply } from 'fastify'
import { Result } from 'neverthrow'
import { MongoServerError } from 'mongodb'
import is from '@sindresorhus/is'

declare module 'fastify' {
  interface FastifyReply {
    result: <T>(result: Result<T, ResultError>) => FastifyReply
  }
}

export enum AppStatusCode {
  BAD_REQUEST = 400,
  USER_NOT_FOUND = 404,
}

export class ResultError extends Error {
  constructor(readonly statusCode: number, message?: string, readonly reason?: unknown) {
    super(message)
  }
}

export const exceptionHandler = (
  exception: unknown | string,
  code: AppStatusCode = AppStatusCode.BAD_REQUEST
): ResultError => {
  if (is.string(exception)) {
    return new ResultError(code.valueOf(), exception)
  } else {
    return new ResultError(AppStatusCode.BAD_REQUEST, exception as string)
  }
}

export const mongoExceptionHandler = (throwable: unknown): ResultError => {
  if (is.directInstanceOf(throwable, MongoServerError) && throwable.code === 121) {
    return new ResultError(
      AppStatusCode.BAD_REQUEST,
      throwable.message,
      throwable?.errInfo?.details?.schemaRulesNotSatisfied
    )
  } else {
    return exceptionHandler(throwable)
  }
}

export default fp<FastifyPluginAsync>(async (fastify) => {
  fastify.setErrorHandler(function (error, request, reply) {
    const statusCode = error.statusCode ?? 400
    fastify.log.error(error, `This error has status code ${error.statusCode}`)
    if (is.directInstanceOf(error, ResultError)) {
      const { reason, message } = error
      void reply.code(statusCode).send({ statusCode, reason, message })
    } else {
      void reply
        .code(statusCode >= 400 ? statusCode : 500)
        .type('text/plain')
        .send(statusCode >= 500 ? 'Internal server error' : error.message)
    }
  })

  fastify.decorateReply('result', function <T>(this: FastifyReply, result: Result<T, ResultError>) {
    if (result.isOk()) {
      return this.send(result.value)
    } else {
      return this.status(result.error.statusCode).send(result.error)
    }
  })
})
