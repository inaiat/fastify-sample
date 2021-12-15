import { FromSchema } from 'json-schema-to-ts';

export const UserSchema = {
  bsonType: 'object',
  properties: {
    name: {
      type: 'string',
    },
    age: {
      bsonType: 'number',
      maximum: 200,
      minimum: 18,
    },
    year_of_birth: {
      bsonType: 'int',
      minimum: 1900,
      maximum: 2021,
    },
  },
  required: ['name', 'age'],
} as const;

export type User = FromSchema<typeof UserSchema>;
