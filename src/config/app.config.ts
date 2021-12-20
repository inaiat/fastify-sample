import { UserSchema } from '@src/user/user.model';
import * as mongoose from 'mongoose';
import { UserService } from '@src/user/user.service';

import { diContainer } from 'fastify-awilix/lib/classic';
import { asClass, asValue } from 'awilix';

class DbConfig {
  static async createConnection(): Promise<mongoose.Connection> {
    return mongoose.createConnection('mongodb://localhost:27017/test');
  }

  static async createCollection<T>(
    connection: Promise<mongoose.Connection>,
    collectionName: string,
    model: mongoose.Model<T>,
  ): Promise<mongoose.Model<T>> {
    return (await connection).model(collectionName, model.schema);
  }
}

export const diInit = () => {
  const connection = DbConfig.createConnection();
  diContainer.register({
    connection: asValue(connection),
    userCollection: asValue(
      DbConfig.createCollection(connection, 'User', UserSchema),
    ),
    userService: asClass(UserService).singleton(),
  });
};
