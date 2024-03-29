import fp from 'fastify-plugin'
import {types, schema, Model} from 'papr'
import fastifyPaprPlugin, {asModel, FastifyPaprOptions} from '@inaiat/fastify-papr'
import fastifyMongodb from '@fastify/mongodb'
import {appConfig} from '../config/app.config.js'

export const userSchema = schema({
	name: types.string({required: true, maxLength: 20}), // TODO: Just to test mongodb validation
	phone: types.string({required: true, minLength: 7, maxLength: 20}),
	age: types.number({required: true, minimum: 18, maximum: 200}),
})

export type UserModel = Model<typeof userSchema[0], Partial<typeof userSchema[1]>>

declare module 'fastify' {
	interface PaprModels {
		user: UserModel;
	}
}

export default fp<FastifyPaprOptions>(
	async fastify => {
		await fastify.register(fastifyMongodb, {
			url: appConfig().DB_URL,
		})

		await fastify.register(fastifyPaprPlugin, {
			db: fastify.mongo.client.db(appConfig().DB_NAME),
			models: {user: asModel('user', userSchema)},
		})
	},
	{name: 'papr'},
)
