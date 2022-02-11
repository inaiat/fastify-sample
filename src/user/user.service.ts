import { ObjectId } from 'mongodb'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import { BaseError, ExceptionHandler } from '../config/error.handler'
import { ResultUser, User, UserModel } from './user.model'
import { UserRepository } from './user.repository'

export type UserServices = ReturnType<typeof defaultUserServices>

const validateUser = (user: User): ResultUser => {
  if (user.name === 'pareto') {
    return errAsync(ExceptionHandler(new Error('You are not allowed to register')))
  } else {
    return okAsync(user)
  }
}

const createUserService =
  (createUserFn: (user: User) => ResultAsync<User, BaseError>) =>
  (user: UserModel, id: ObjectId = new ObjectId()): ResultUser => {
    const userDomain: User = {
      _id: id,
      name: user.name,
      age: user.age,
      yearOfBirth: new Date().getFullYear() - user.age,
    }
    return validateUser(userDomain).andThen(createUserFn)
  }

const userNotFound = (user: User | null): ResultUser => {
  if (user === null) {
    return errAsync(ExceptionHandler(new Error('User not found')))
  } else {
    return okAsync(user)
  }
}

export const defaultUserServices = (userRepository: UserRepository) => ({
  findAll: userRepository.findall,
  findById: (id: string) => userRepository.findById(id).andThen(userNotFound),
  create: (user: UserModel, id?: ObjectId) => createUserService(userRepository.createUser)(user, id),
})
