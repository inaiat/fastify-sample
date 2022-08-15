import {join, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import {fastifyAutoload} from '@fastify/autoload'
import pino from 'pino'
import {FastifyBaseLogger, FastifyPluginAsync, FastifyLoggerOptions, FastifyServerOptions} from 'fastify'
import {nanoid} from 'nanoid'

const xRequestId = 'x-request-id'

export type CustomServerOptions = {
	readonly logger: FastifyLoggerOptions;
} & Partial<FastifyServerOptions>

const formatter = {
	level(level: string) {
		return {level}
	},
}

export const serverOptions: CustomServerOptions = {
	genReqId(request) {
		const serverRequestId = request.headers[xRequestId] as string | undefined
		if (serverRequestId) {
			return serverRequestId
		}

		return nanoid()
	},
	logger: {
		level: 'info',
		formatters: formatter,
	},
}

export const logger = pino(serverOptions.logger) as FastifyBaseLogger

const pluginLoader: FastifyPluginAsync = async (fastify, options) => {
	void fastify
		.register(fastifyAutoload, {
			dir: join(dirname(fileURLToPath(import.meta.url)), '../plugins'),
			forceESM: true,
			options,
		})
		.after(error => {
			if (error === null) {
				logger.info('All plugins loaded successfuly')
			} else {
				logger.error(error, 'Error on loading plugin(s)')
				// If app didn't load all plugins correctly an exception must be throw and app must be break
				// eslint-disable-next-line functional/no-throw-statement
				throw error
			}
		})
}

export default pluginLoader
