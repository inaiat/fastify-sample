import { FromSchema } from 'json-schema-to-ts';
import { ObjectId } from 'mongodb';

export interface BaseEntity {
  _id?: ObjectId;
}

export const UserModelSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: {
      type: 'number',
      maximum: 200,
      minimum: 18,
    },
  },
  required: ['name', 'age'],
} as const;

export type UserModel = FromSchema<typeof UserModelSchema>;

export type UserSchema = BaseEntity & UserModel;
