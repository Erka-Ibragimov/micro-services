import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async find(data: { id: number; login: string }) {
    return await this.userRepository.find({
      where: { client: { id: data.id } },
    });
  }

  async findOneBy(data: { id: number; client: { id: number; login: string } }) {
    return await this.userRepository.findOneBy({
      id: data.id,
      client: { id: data.client.id },
    });
  }

  async update(data: { user: User; data: { name: string; age: number } }) {
    data.user.age = data.data.age;
    data.user.name = data.data.name;

    await this.userRepository.save(data.user);

    return { message: true };
  }

  async create(data: {
    client: { id: number; login: string };
    data: { name: string; age: number };
  }) {
    const newUser = this.userRepository.create({
      name: data.data.name,
      age: data.data.age,
      client: { id: data.client.id },
    });

    await this.userRepository.save(newUser, { reload: true });

    return newUser;
  }

  async delete(user: User) {
    await this.userRepository.remove(user);

    return { message: true };
  }
}
