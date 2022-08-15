import {ObjectId} from 'mongodb'
import {errAsync, okAsync, ResultAsync} from 'neverthrow'
import {ResultError, exceptionHandler, notFoundErrorHandler} from '../plugins/error.handler.js'
import {User, UserDto} from './user.model.js'
import {UserRepository} from './user.repository.js'

type ResultUser = ResultAsync<User, ResultError>

export type UserServices = ReturnType<typeof defaultUserServices>

const validateUser = (user: User): ResultUser => {
	if (user.name === 'admin') {
		return errAsync(exceptionHandler('You are not allowed to register'))
	}

	return okAsync(user)
}

const createUserService
= (createUserFn: (user: User) => ResultAsync<User, ResultError>) =>
	(user: UserDto, id: ObjectId = new ObjectId()): ResultUser => {
		const userDomain: User = {
			_id: id,
			name: user.name,
			age: user.age,
			phone: user.phone,
		}
		return validateUser(userDomain).andThen(createUserFn)
	}

const userNotFound = (user: User | undefined): ResultUser =>
	(user === undefined) ? errAsync(notFoundErrorHandler('User not found')) : okAsync(user)

export const defaultUserServices = (userRepository: UserRepository) => ({
	findAll: () => userRepository.findall(),
	findById: (id: string) => userRepository.findById(id).andThen(userNotFound),
	create: (user: UserDto, id?: ObjectId) => createUserService(userRepository.createUser)(user, id),
})
