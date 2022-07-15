import { ObjectId } from 'mongodb'
import { types, schema } from 'papr'
import { Static, Type } from '@sinclair/typebox'

export const UserDtoSchema = Type.Object({
  name: Type.String({ maxLength: 100 }),
  age: Type.Number({ maximum: 200, minimum: 18 }),
})

export type UserDto = Static<typeof UserDtoSchema>

export interface User extends UserDto {
  readonly _id?: ObjectId
  readonly yearOfBirth: number
}

export const userSchema = schema({
  name: types.string({ required: true, maxLength: 20 }), //TODO: Just to test mongodb validation
  yearOfBirth: types.number({ required: true, minimum: 1900 }),
  age: types.number({ required: true, minimum: 18, maximum: 200 }),
})

export type UserDocument = typeof userSchema[0]
