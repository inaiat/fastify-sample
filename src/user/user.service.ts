import { ObjectId } from 'mongodb';
import { UserDomain, UserModel } from './user.model';
import { UserRepository } from './user.repository';

export class UserService {
  async create(user: UserModel, id: ObjectId = new ObjectId()) : Promise<ObjectId> {
    const userDomain = user as UserDomain
    userDomain._id = id
    await this.userRepository.create(userDomain);
    return userDomain._id
  }
  constructor(private readonly userRepository: UserRepository) {}

  public static inject = ['userRepository'] as const;

  findAll(): Promise<UserModel[]> {
    return this.userRepository.findAll();
  }
}
