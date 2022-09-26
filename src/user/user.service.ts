import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreateInput, UserCreateOutput } from './dto/user-create.dto';
import { User } from './models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
  ) {}

  async userGet(email: User['email']): Promise<User> {
    return await this.UserRepository.findOneOrFail({ email });
  }

  async userGetById(id: User['id']): Promise<User> {
    return await this.UserRepository.findOneOrFail({ id })
  }

  async userCreate(input: UserCreateInput): Promise<UserCreateOutput> {
    const user = this.UserRepository.create(input);
    await user.save();
    return {
      user,
    };
  }
}
