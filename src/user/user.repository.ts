import { ResultAsync } from 'neverthrow'
import { Model } from 'papr'
import { mongoExceptionHandler } from '../config/error.handler'
import { User, UserDocument } from './user.model'

export type UserCollection = Model<UserDocument, Partial<UserDocument>>

export type UserRepository = ReturnType<typeof defaultUserRepository>

export const defaultUserRepository = (userCollection: UserCollection) => ({
  findall: () =>
    ResultAsync.fromPromise(userCollection.find({}), mongoExceptionHandler).map((r) => r as readonly User[]),
  findByName: (name: string) => ResultAsync.fromPromise(userCollection.findOne({ name }), mongoExceptionHandler),
  findById: (id: string) => ResultAsync.fromPromise(userCollection.findById(id), mongoExceptionHandler),
  createUser: (user: User) => ResultAsync.fromPromise(userCollection.insertOne(user), mongoExceptionHandler),
})
