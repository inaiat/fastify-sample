import { MongoClient } from 'mongodb'
import { fromPromise, fromThrowable } from 'neverthrow'
import Papr from 'papr'
import { userSchema } from '../user/user.model'
import { exceptionHandler } from './error.handler'

export type MongoConfig = ReturnType<typeof defaultMongoConfig>

const papr = new Papr()

const safeInitialize = fromThrowable((client: MongoClient, dbName: string) => {
  papr.initialize(client.db(dbName))
  return client
}, exceptionHandler)

export const defaultMongoConfig = async (dbUrl: string, dbName: string) =>
  fromPromise(MongoClient.connect(dbUrl), exceptionHandler)
    .andThen((c) => safeInitialize(c, dbName))
    .map((client) => ({
      papr,
      connection: client,
      userModel: papr.model('User', userSchema),
      disconect: () => client.close(),
    }))
