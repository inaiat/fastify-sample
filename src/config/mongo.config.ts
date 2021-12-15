import * as mongoDB from 'mongodb';

export class MongoConfig {
  static createClient(): mongoDB.MongoClient {
    const client = new mongoDB.MongoClient('mongodb://localhost:27017/test');
    console.log('mongo client connected');
    client
      .connect()
      .then((c) => {
        console.log('mongo connection is ok');
      })
      .catch((err) => {
        console.error('error on connect', err);
      });
    return client;
  }

  static createDatabase(dbName: string, client: mongoDB.MongoClient): mongoDB.Db {
    return client.db(dbName);
  }

  static createCollection<T>({
    colName,
    db,
    dbName,
  }: {
    colName: string;
    db?: mongoDB.Db;
    dbName?: string;
  }): mongoDB.Collection<T> {
    if (dbName != undefined) {
      const client = this.createClient();
      const db = this.createDatabase(dbName, client);
      return db.collection<T>(colName);
    } else if (db == undefined) {
      throw new Error('mongo database parameter is required to create collection');
    } else {
      return db.collection<T>(colName);
    }
  }
}
