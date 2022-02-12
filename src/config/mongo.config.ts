import { MongoClient } from 'mongodb'
import Papr from 'papr'
import { userSchema } from '../user/user.model'

export type MongoConfig = ReturnType<typeof defaultMongoConfig>

export const defaultMongoConfig = async (dbUrl: string) => {
  const papr = new Papr()

  const client = await MongoClient.connect(dbUrl)
  papr.initialize(client.db('test'))

  async function disconnect() {
    await client.close()
  }

  const userModel = papr.model('User', userSchema)

  await papr.updateSchemas()

  return {
    papr,
    client,
    userModel,
    disconnect,
  }
}
