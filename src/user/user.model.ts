import { FromSchema } from 'json-schema-to-ts';
import { ObjectId } from 'mongodb';
import { model, Schema } from 'mongoose';

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

export interface User extends BaseEntity {
  name: string;
  yearOfBirth: number;
  age: number;
}

export const UserSchema = model<User>(
  'User',
  new Schema<User>({
    name: { type: String, required: true, maxlength: 10 },
    yearOfBirth: { type: Number, required: true, min: 1900 },
    age: { type: Number, required: true, min: 18, max: 200 },
  }),
);
