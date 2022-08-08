import { ObjectId } from 'mongodb'
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
