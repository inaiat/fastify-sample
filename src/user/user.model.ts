import { ObjectId } from 'mongodb'
import { model, Schema } from 'mongoose'
import { Static, Type } from '@sinclair/typebox'
import { ResultAsync } from 'neverthrow'
import { BaseError } from '../config/error.handler'

export const UserModelSchema = Type.Object({
  name: Type.String({ maxLength: 100 }),
  age: Type.Number({ maximum: 200, minimum: 18 }),
})

export type ResultUser = ResultAsync<User, BaseError>

export type UserModel = Static<typeof UserModelSchema>

export interface User extends UserModel {
  readonly _id?: ObjectId
  readonly yearOfBirth: number
}

export const UserSchema = model<User>(
  'User',
  new Schema<User>({
    name: { type: String, required: true, maxlength: 10 },
    yearOfBirth: { type: Number, required: true, min: 1900 },
    age: { type: Number, required: true, min: 18, max: 200 },
  })
)
