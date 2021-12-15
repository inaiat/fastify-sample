import { UserModel } from '@src/user/user.model';
import { UserRepository } from '@src/user/user.repository';
import { UserService } from '@src/user/user.service';
import { up } from 'migrate-mongo';
import { MongoClient } from 'mongodb';
import { createInjector } from 'typed-inject';
import { MongoConfig } from './mongo.config';

export class AppModule {
  private mongoClient = MongoConfig.createClient();
  private mongoDb = MongoConfig.createDatabase('user', this.mongoClient);

  injector = createInjector()
    .provideValue('client', this.mongoClient)
    .provideValue('database', this.mongoDb)
    .provideValue(
      'userCollection',
      MongoConfig.createCollection<UserModel>({
        colName: 'user',
        db: this.mongoDb,
      }),
    )
    .provideClass('userRepository', UserRepository)
    .provideClass('userService', UserService);

  getUserService(): UserService {
    return this.injector.injectClass(UserService);
  }

  migrations() {
    const client: MongoClient = this.injector.resolve('client');
    const db = client.db('user');
    up(db, client);
  }
}
