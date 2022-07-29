import { User } from '@prisma/client/index.js'
import { ObjectId } from 'mongodb'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import { UserModel } from 'plugins/di.config.js'
import { ResultError, exceptionHandler, notFoundErrorHandler } from '../plugins/error.handler.js'
import { UserDto } from './user.model.js'

type ResultUser = ResultAsync<User, ResultError>

export type UserServices = ReturnType<typeof defaultUserServices>

const validateUser = (user: User): ResultUser => {
  if (user.name === 'pareto') {
    return errAsync(exceptionHandler('You are not allowed to register'))
  } else {
    return okAsync(user)
  }
}

const fillUserAttr = (user: UserDto, id: string = new ObjectId().toHexString()): ResultUser =>
  okAsync({
    id: id,
    name: user.name,
    age: user.age,
    yearOfBirth: new Date().getFullYear() - user.age,
  })

const userNotFound = (user: User | null): ResultUser => {
  if (user === null) {
    return errAsync(notFoundErrorHandler('User not found'))
  } else {
    return okAsync(user)
  }
}

export const defaultUserServices = (userCollection: UserModel) => ({
  bla: async (user: User) => await userCollection.create({ data: user }),
  findAll: () => ResultAsync.fromPromise(userCollection.findMany(), exceptionHandler),
  findById: (id: string) =>
    ResultAsync.fromPromise(userCollection.findUnique({ where: { id } }), exceptionHandler).andThen(userNotFound),
  create: (user: UserDto, id?: string) =>
    fillUserAttr(user, id)
      .andThen(validateUser)
      .map((u) => userCollection.create({ data: u })),
})
