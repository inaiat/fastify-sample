import { MongoClient } from 'mongodb'
import { fromPromise, fromThrowable, ok } from 'neverthrow'
import Papr from 'papr'
import { userSchema } from '../user/user.model'
import { exceptionHandler } from './error.handler'

export type MongoConfig = ReturnType<typeof defaultMongoConfig>

const papr = new Papr()

const safeInitialize = fromThrowable(
  (client: MongoClient, dbName: string) => papr.initialize(client.db(dbName)),
  exceptionHandler
)

export const defaultMongoConfig = async (dbUrl: string, dbName: string) =>
  fromPromise(MongoClient.connect(dbUrl), exceptionHandler).andThen((client) =>
    safeInitialize(client, dbName)
      .map(() => fromPromise(papr.updateSchemas(), exceptionHandler))
      .map(() => ({
        papr,
        connection: client,
        userModel: papr.model('User', userSchema),
        disconect: () => client.close(),
      }))
  )
