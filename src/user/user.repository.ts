import { Model } from 'mongoose'
import { fromPromise } from 'neverthrow'
import { BaseError, ExceptionHandler } from '../config/error.handler'
import { User } from './user.model'

type UserCollection = Model<User>

export type UserRepository = ReturnType<typeof defaultUserRepository>

export const defaultUserRepository = (userCollection: UserCollection) => ({
  findall: () => fromPromise<readonly User[], BaseError>(userCollection.find({}).exec(), ExceptionHandler),
  findByName: (name: string) =>
    fromPromise<User | null, BaseError>(userCollection.findOne({ name }).exec(), ExceptionHandler),
  findById: (id: string) => fromPromise<User | null, BaseError>(userCollection.findById(id).exec(), ExceptionHandler),
  createUser: (user: User) => fromPromise<User, BaseError>(userCollection.create(user), ExceptionHandler),
})
