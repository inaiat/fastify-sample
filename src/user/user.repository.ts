import * as mongoDB from 'mongodb';
import { UserSchema, UserModel } from './user.model';

export class UserRepository {
  constructor(private readonly collection: mongoDB.Collection<UserModel>) {}

  public static inject = ['userCollection'] as const;

  async findAll(): Promise<UserModel[]> {
    return (await this.collection.find({}).toArray()) as UserModel[];
  }

  async create(user: UserSchema) {
    try {
      const result = await this.collection.insertOne(user);
      console.log('Document created successfully', result);
    } catch (error) {
      if (error instanceof mongoDB.MongoServerError) {
        throw new Error(`Mongo create error: ${JSON.stringify(error.errInfo)}`);
      } else {
        throw error;
      }
    }
  }
}
