import { Static, Type } from '@sinclair/typebox'

export const UserDtoSchema = Type.Object({
  name: Type.String({ maxLength: 100 }),
  age: Type.Number({ maximum: 200, minimum: 18 }),
})

export type UserDto = Static<typeof UserDtoSchema>
