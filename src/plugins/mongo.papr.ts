import { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import { MongoClient } from 'mongodb'
import { fromPromise, fromThrowable } from 'neverthrow'
import Papr from 'papr'
import { userSchema } from '../user/user.model'
import { appConfig } from '../config/app.config'
import { exceptionHandler } from '../config/error.handler'
import { logger } from '../config/fastify.config'

declare module 'fastify' {
  interface FastifyInstance {
    readonly mongo: MongoClient
  }
}

const papr = new Papr()
export const userModel = papr.model('User', userSchema)

const safeInitialize = fromThrowable(
  (client: MongoClient, dbName: string) => papr.initialize(client.db(dbName)),
  exceptionHandler
)

const mongoPlugin: FastifyPluginCallback = (fastify, opts, done) => {
  const app = appConfig()
  void fromPromise(MongoClient.connect(app.DB_URL), exceptionHandler)
    .andThen((client) =>
      safeInitialize(client, app.DB_NAME)
        .map(() => fromPromise(papr.updateSchemas(), exceptionHandler))
        .map(() => client)
    )
    .match(
      (client) => {
        fastify.decorate('mongo', client)
        fastify.addHook('onClose', async (instance, done) => {
          await client.close().then(void done())
        })
        done()
      },
      (error) => logger.error(error, 'Mongo initiazation error')
    )
}

export default fp(mongoPlugin, { name: 'mongo' })
