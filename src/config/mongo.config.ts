import { MongoClient } from 'mongodb'
import { fromPromise } from 'neverthrow'
import Papr from 'papr'
import { userSchema } from '../user/user.model'
import { exceptionHandler } from './error.handler'

export type MongoConfig = ReturnType<typeof defaultMongoConfig>

const papr = new Papr()

export const defaultMongoConfig = async (dbUrl: string, dbName: string) =>
  fromPromise(MongoClient.connect(dbUrl), exceptionHandler).map((client) => {
    papr.initialize(client.db(dbName))
    return {
      papr,
      connection: client,
      userModel: papr.model('User', userSchema),
      disconect: () => client.close(),
    }
  })
