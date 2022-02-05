import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { User, UserModel } from './user.model';

type UserCollection = Promise<Model<User>>;

export function createUserService(userCollection: UserCollection) {
  return async (user: UserModel, id: ObjectId = new ObjectId()) => {
    const userDomain: User = {
      _id: id,
      name: user.name,
      age: user.age,
      yearOfBirth: new Date().getFullYear() - user.age,
    };
    const doc = (await userCollection).create(userDomain);
    return (await doc)._id;
  };
}

export function findAllService(userCollection: UserCollection) {
  return async () => (await userCollection).find({});
}