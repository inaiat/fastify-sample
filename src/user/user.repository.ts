import {ResultAsync} from 'neverthrow'
import {UserModel} from '../plugins/papr.js'
import {mongoExceptionHandler} from '../plugins/error.handler.js'
import {User} from './user.model.js'

export type UserRepository = ReturnType<typeof defaultUserRepository>

const nullToUndefined = <T>(object: T) =>
	object === null ? undefined : object

export const defaultUserRepository = (userModel: UserModel) => ({
	findall: () =>
		ResultAsync.fromPromise(userModel.find({}), mongoExceptionHandler).map(
			r => r as readonly User[],
		),
	findByName: (name: string) =>
		ResultAsync.fromPromise(userModel.findOne({name}), mongoExceptionHandler)
			.map(r => r as User)
			.map(nullToUndefined),
	findById: (id: string) =>
		ResultAsync.fromPromise(userModel.findById(id), mongoExceptionHandler)
			.map(r => r as User)
			.map(nullToUndefined),
	createUser: (user: User) =>
		ResultAsync.fromPromise(userModel.insertOne(user), mongoExceptionHandler),
})
