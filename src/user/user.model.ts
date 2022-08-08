import { ObjectId } from 'mongodb'
import { Static, Type } from '@sinclair/typebox'

export const UserDtoSchema = Type.Object({
  name: Type.String({ maxLength: 100 }),
  age: Type.Number({ maximum: 200, minimum: 18 }),
  phone: Type.String({ minLength: 7, maxLength: 20 }),
})

export type UserDto = Static<typeof UserDtoSchema>

export interface User extends UserDto {
  readonly _id?: ObjectId
  readonly age: number
  readonly phone: string
}
