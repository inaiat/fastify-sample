import { AppError } from '@src/config/app.config'
import { ObjectId } from 'mongodb'
import { Model, Error } from 'mongoose'
import { errAsync, ResultAsync } from 'neverthrow'
import { User, UserModel } from './user.model'

type UserCollection = Promise<Model<User>>

const toParseError = (e: unknown): AppError => {
  const ve = e instanceof Error.ValidationError
  if (ve) {
    return { message: e.message, validationError: true, throwable: e }
  } else {
    return { message: 'Database operation error', validationError: false, throwable: e }
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
    // To simulate some business logic
    if (user.name.toLowerCase() === 'pareto')
      return errAsync({ throwable: new Error('You are not allowed to register'), validationError: true })
    return ResultAsync.fromPromise((await userCollection).create(userDomain), toParseError)
  }
}

export function findAllService(userCollection: UserCollection) {
  const findAll = async () => (await userCollection).find<User>({})
  return async () => ResultAsync.fromPromise(findAll(), toParseError)
}
