import { UserSchema } from '@src/user/user.model';
import { createInjector } from 'typed-inject';
import * as mongoose from 'mongoose';
import { UserService } from '@src/user/user.service';

async function createConnection(): Promise<mongoose.Connection> {
  return mongoose.createConnection('mongodb://localhost:27017/test');
}

async function createCollection<T>(
  connection: Promise<mongoose.Connection>,
  collectionName: string,
  model: mongoose.Model<T>,
): Promise<mongoose.Model<T>> {
  return (await connection).model(collectionName, model.schema);
}

export class AppModule {
  private connection = createConnection();

  injector = createInjector()
    .provideValue('client', this.connection)
    .provideValue(
      'userCollection',
      createCollection(this.connection, 'User', UserSchema),
    )
    .provideClass('userService', UserService);

  getUserService(): UserService {
    return this.injector.injectClass(UserService);
  }
}
