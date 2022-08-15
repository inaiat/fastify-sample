import {join} from 'node:path/posix'
import {fileURLToPath} from 'node:url'
import {dirname} from 'node:path'
import fp from 'fastify-plugin'
import {FastifyPluginAsync} from 'fastify'
import fastifyAutoload from '@fastify/autoload'

export default fp<FastifyPluginAsync>(
	async (fastify, options) => {
		await fastify.register(fastifyAutoload, {
			dir: join(dirname(fileURLToPath(import.meta.url)), '../routes'),
			options,
			forceESM: true,
		})
	},
	{dependencies: ['swagger']},
)
