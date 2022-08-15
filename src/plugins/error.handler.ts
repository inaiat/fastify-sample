import fp from 'fastify-plugin'
import {FastifyPluginAsync, FastifyReply} from 'fastify'
import {Result} from 'neverthrow'
import {MongoServerError} from 'mongodb'
import is from '@sindresorhus/is'

declare module 'fastify' {
	interface FastifyReply {
		result: <T>(result: Result<T, ResultError>) => FastifyReply;
	}
}

export class ResultError extends Error {
	constructor(message?: string, readonly statusCode = 400, readonly reason?: unknown) {
		super(message)
	}
}

export const notFoundErrorHandler = (exception: unknown | string) => exceptionHandler(exception, 404)

export const exceptionHandler = (exception: unknown | string, statusCode = 400, reason?: unknown) => {
	if (is.string(exception)) {
		return new ResultError(exception, statusCode, reason)
	}

	return new ResultError(exception as string, statusCode, reason)
}

export const mongoExceptionHandler = (throwable: unknown): ResultError => {
	if (is.directInstanceOf(throwable, MongoServerError) && throwable.code === 121) {
		return exceptionHandler(throwable.message, 400, throwable?.errInfo?.details?.schemaRulesNotSatisfied)
	}

	return exceptionHandler(throwable)
}

export default fp<FastifyPluginAsync>(async fastify => {
	fastify.setErrorHandler((error, request, reply) => {
		const statusCode = error.statusCode ?? 400
		fastify.log.error(error, `This error has status code ${statusCode}`)
		if (is.directInstanceOf(error, ResultError)) {
			const {reason, message} = error
			void reply.code(statusCode).send({statusCode, reason, message})
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
		}

		return this.status(result.error.statusCode).send(result.error)
	})
})
