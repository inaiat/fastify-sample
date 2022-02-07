import { BaseException } from '@src/config/app.config'
import { ObjectId } from 'mongodb'
import { Model, Error } from 'mongoose'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import { User, UserModel } from './user.model'

type UserCollection = Promise<Model<User>>

export const DbParseError = (e: unknown): BaseException => {
  const ve = e instanceof Error.ValidationError
  if (ve) {
    return { throwable: e, validationError: true }
  } else {
    return { throwable: e, validationError: false }
  }
}

export function validateUser(user: User): ResultAsync<User, BaseException> {
  if (user.name === 'pareto') {
    return errAsync<User, BaseException>(DbParseError(new Error('You are not allowed to register')))
  } else {
    return okAsync<User, BaseException>(user)
  }
}

export function createUserService(userCollection: UserCollection) {
  return async (user: UserModel, id: ObjectId = new ObjectId()) => {
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

    return (await validateUser(userDomain)).asyncAndThen<User, BaseException>(createUser)
  }
}

export interface FindServices {
  findAll(): ResultAsync<User[], BaseException>
  findById(id: string): ResultAsync<User | null, BaseException>
}

export function findServices(userCollection: UserCollection) {
  const findall = async () => (await userCollection).find<User>({})
  const findById = async (id: string) => (await userCollection).findById<User>(id)
  const services: FindServices = {
    findAll: () => ResultAsync.fromPromise(findall(), DbParseError),
    findById: (id: string) => ResultAsync.fromPromise(findById(id), DbParseError),
  }
  return async () => services
}
