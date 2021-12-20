import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { User, UserModel } from './user.model';

export class UserService {
  async create(
    user: UserModel,
    id: ObjectId = new ObjectId(),
  ): Promise<ObjectId> {
    const userDomain: User = {
      _id: id,
      name: user.name,
      age: user.age,
      yearOfBirth: new Date().getFullYear() - user.age,
    };

    const doc = (await this.userCollection).create(userDomain);
    return (await doc)._id;
  }
  constructor(private readonly userCollection: Promise<Model<User>>) {}

  async findAll(): Promise<User[]> {
    console.log(JSON.stringify(this.userCollection));
    return (await this.userCollection).find({});
  }
}
