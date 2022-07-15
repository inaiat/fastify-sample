import { ObjectId } from 'mongodb'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import { ResultError, exceptionHandler, AppStatusCode } from '../plugins/error.handler.js'
import { User, UserDto } from './user.model.js'
import { UserRepository } from './user.repository.js'

type ResultUser = ResultAsync<User, ResultError>

export type UserServices = ReturnType<typeof defaultUserServices>

const validateUser = (user: User): ResultUser => {
  if (user.name === 'pareto') {
    return errAsync(exceptionHandler(new Error('You are not allowed to register')))
  } else {
    return okAsync(user)
  }
}

const createUserService =
  (createUserFn: (user: User) => ResultAsync<User, ResultError>) =>
  (user: UserDto, id: ObjectId = new ObjectId()): ResultUser => {
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
    return errAsync(exceptionHandler('User not found', AppStatusCode.USER_NOT_FOUND))
  } else {
    return okAsync(user)
  }
}

export const defaultUserServices = (userRepository: UserRepository) => ({
  findAll: () => userRepository.findall(),
  findById: (id: string) => userRepository.findById(id).andThen(userNotFound),
  create: (user: UserDto, id?: ObjectId) => createUserService(userRepository.createUser)(user, id),
})
