import { Model } from 'mongoose'
import { ResultAsync } from 'neverthrow'
import { DefaultExceptionHandler } from '../config/app.config'
import { User } from './user.model'

type UserCollection = Promise<Model<User>>

export const findall = (userCollection: UserCollection) =>
  ResultAsync.fromPromise(userCollection, DefaultExceptionHandler)
    .map<User[]>(async (c) => c.find({}))
    .mapErr(DefaultExceptionHandler)

export const findById = (userCollection: UserCollection) => (id: string) =>
  ResultAsync.fromPromise(userCollection, DefaultExceptionHandler)
    .map<User | null>(async (c) => c.findById<User>(id))
    .mapErr(DefaultExceptionHandler)

export const createUser = (userCollection: UserCollection) => (user: User) =>
  ResultAsync.fromPromise(userCollection, DefaultExceptionHandler)
    .map<User>((u) => u.create(user))
    .mapErr(DefaultExceptionHandler)
