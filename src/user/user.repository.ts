import { MongoServerError } from 'mongodb'
import { ResultAsync } from 'neverthrow'
import { Model } from 'papr'
import { BaseError } from '../config/error.handler'
import { logger } from '../config/logger.config'
import { User, UserDocument } from './user.model'

export type UserCollection = Model<UserDocument, Partial<UserDocument>>

export type UserRepository = ReturnType<typeof defaultUserRepository>

export const MongoExceptionHandler = (throwable: unknown): BaseError => {
  if (throwable instanceof MongoServerError && throwable.code === 121) {
    logger.error(throwable?.errInfo, 'Mongo validation error')
    return { validationError: true, throwable: new Error(throwable.message) }
  } else {
    logger.error(throwable, 'Mongo error')
    return { validationError: false, throwable }
  }
}

export const defaultUserRepository = (userCollection: UserCollection) => ({
  findall: () =>
    ResultAsync.fromPromise(userCollection.find({}), MongoExceptionHandler).map((r) => r as readonly User[]),
  findByName: (name: string) => ResultAsync.fromPromise(userCollection.findOne({ name }), MongoExceptionHandler),
  findById: (id: string) => ResultAsync.fromPromise(userCollection.findById(id), MongoExceptionHandler),
  createUser: (user: User) => ResultAsync.fromPromise(userCollection.insertOne(user), MongoExceptionHandler),
})
