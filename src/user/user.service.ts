import { ObjectId } from 'mongodb'
import { Model, Error } from 'mongoose'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import { BaseError, ExceptionHandler } from '../config/error.handler'
import { ResultUser, User, UserModel } from './user.model'
import { createUser, findall, findById } from './user.repository'

export type UserCollection = Promise<Model<User>>

export interface UserServices {
  findAll(): ResultAsync<readonly User[], BaseError>
  findById(id: string): ResultAsync<User | null, BaseError>
  create(user: UserModel, id?: ObjectId): ResultUser
}

const validateUser = (user: User): ResultUser => {
  if (user.name === 'pareto') {
    return errAsync(ExceptionHandler(new Error('You are not allowed to register')))
  } else {
    return okAsync(user)
  }
}

const createUserService =
  (userCollection: UserCollection) =>
  (user: UserModel, id: ObjectId = new ObjectId()): ResultUser => {
    const userDomain: User = {
      _id: id,
      name: user.name,
      age: user.age,
      yearOfBirth: new Date().getFullYear() - user.age,
    }
    return validateUser(userDomain).andThen(createUser(userCollection))
  }

const userNotFound = (user: User | null): ResultUser => {
  if (user === null) {
    return errAsync(ExceptionHandler(new Error('User not found')))
  } else {
    return okAsync(user)
  }
}

export const defaultUserServices = (userCollection: UserCollection): UserServices => ({
  findAll: () => findall(userCollection),
  findById: (id: string) => findById(userCollection)(id).andThen(userNotFound),
  create: (user: UserModel, id?: ObjectId) => createUserService(userCollection)(user, id),
})
