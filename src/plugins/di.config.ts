import fp from 'fastify-plugin'
import {asFunction, asValue} from 'awilix'
import {FastifyPluginAsync} from 'fastify'
import {fastifyDiPlugin} from '@inaiat/fastify-di-plugin'
import {appConfig, Env} from '../config/app.config.js'
import {defaultUserRepository, UserRepository} from '../user/user.repository.js'
import {defaultUserServices, UserServices} from '../user/user.service.js'
import {UserModel} from './papr.js'

declare module '@inaiat/fastify-di-plugin' {
	interface Cradle {
		readonly config: Env;
		readonly userRepository: UserRepository;
		readonly userModel: UserModel;
		readonly userServices: UserServices;
	}
}

export default fp<FastifyPluginAsync>(
	async fastify => {
		await fastify.register(fastifyDiPlugin, {
			module: {
				config: asValue(appConfig()),
				userRepository: asFunction(defaultUserRepository).singleton(),
				userModel: asValue(fastify.papr.user),
				userServices: asFunction(defaultUserServices).singleton(),
			}, injectionMode: 'CLASSIC',

		})
	},
	{name: 'di.config', dependencies: ['papr']},
)
