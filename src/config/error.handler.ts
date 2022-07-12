import { MongoServerError } from 'mongodb'
import { logger } from './fastify.config.js'

export interface BaseError {
  readonly validationError: boolean
  readonly throwable: unknown | undefined
}

export const exceptionHandler = (throwable: unknown, validationError = false): BaseError => ({
  throwable,
  validationError,
})

export const mongoExceptionHandler = (throwable: unknown): BaseError => {
  if (throwable instanceof MongoServerError && throwable.code === 121) {
    logger.error(throwable?.errInfo, 'Mongo validation error')
    return { validationError: true, throwable: new Error(throwable.message) }
  } else {
    logger.error(throwable, 'Mongo error')
    return { validationError: false, throwable }
  }
}
