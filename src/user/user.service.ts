import { ObjectId } from 'mongodb'
import { Model, Error } from 'mongoose'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import { BaseException, DefaultExceptionHandler } from '../config/app.config'
import { User, UserModel } from './user.model'
import { createUser, findall, findById } from './user.repository'

export type UserCollection = Promise<Model<User>>

export interface UserServices {
  findAll(): ResultAsync<User[], BaseException>
  findById(id: string): ResultAsync<User | null, BaseException>
  create(user: UserModel, id?: ObjectId): ResultAsync<User, BaseException>
}

export function validateUser(user: User): ResultAsync<User, BaseException> {
  if (user.name === 'pareto') {
    return errAsync(DefaultExceptionHandler(new Error('You are not allowed to register')))
  } else {
    return okAsync(user)
  }
}

const createUserService =
  (userCollection: UserCollection) =>
  (user: UserModel, id: ObjectId = new ObjectId()) => {
    const userDomain: User = {
      _id: id,
      name: user.name,
      age: user.age,
      yearOfBirth: new Date().getFullYear() - user.age,
    }
    return validateUser(userDomain).andThen<User, BaseException>(createUser(userCollection))
  }

export const defaultUserServices = (userCollection: UserCollection): UserServices => ({
  findAll: () => findall(userCollection),
  findById: (id: string) => findById(userCollection)(id),
  create: (user: UserModel, id?: ObjectId) => createUserService(userCollection)(user, id),
})
