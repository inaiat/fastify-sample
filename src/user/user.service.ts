import { BaseException } from '@src/config/app.config'
import { create } from 'domain'
import { ObjectId } from 'mongodb'
import { Model, Error } from 'mongoose'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import { User, UserModel } from './user.model'
import { findall, findById } from './user.repository'

type UserCollection = Promise<Model<User>>

export const DbParseError = (e: unknown): BaseException => ({
  throwable: e,
  validationError: e instanceof Error.ValidationError,
})

export function validateUser(user: User): ResultAsync<User, BaseException> {
  if (user.name === 'pareto') {
    return errAsync(DbParseError(new Error('You are not allowed to register')))
  } else {
    return okAsync(user)
  }
}

export const createUserService =
  (userCollection: UserCollection) =>
  (user: UserModel, id: ObjectId = new ObjectId()) => {
    const userDomain: User = {
      _id: id,
      name: user.name,
      age: user.age,
      yearOfBirth: new Date().getFullYear() - user.age,
    }

    const createUser = (user: User) =>
      ResultAsync.fromPromise(userCollection, DbParseError)
        .map<User>((u) => u.create(user))
        .mapErr(DbParseError)

    return validateUser(userDomain).andThen<User, BaseException>(createUser)
  }

export interface FindServices {
  findAll(): ResultAsync<User[], BaseException>
  findById(id: string): ResultAsync<User | null, BaseException>
}

export const findServices = (userCollection: UserCollection): FindServices => ({
  findAll: () => findall(userCollection),
  findById: (id: string) => findById(userCollection, id),
})
