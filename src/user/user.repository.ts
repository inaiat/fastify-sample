import { Model } from 'mongoose'
import { ResultAsync } from 'neverthrow'
import { DefaultExceptionHandler } from '../config/app.config'
import { User } from './user.model'

type UserCollection = Promise<Model<User>>

const wrapCollection = (userCollection: UserCollection) =>
  ResultAsync.fromPromise(userCollection, DefaultExceptionHandler)

export const findall = (userCollection: UserCollection) =>
  wrapCollection(userCollection)
    .map<User[]>(async (c) => c.find({}))
    .mapErr(DefaultExceptionHandler)

export const findById = (userCollection: UserCollection) => (id: string) =>
  wrapCollection(userCollection)
    .map<User | null>(async (c) => c.findById<User>(id))
    .mapErr(DefaultExceptionHandler)

export const createUser = (userCollection: UserCollection) => (user: User) =>
  wrapCollection(userCollection)
    .map<User>((u) => u.create(user))
    .mapErr(DefaultExceptionHandler)
