import { HttpException, Injectable } from '@nestjs/common';
import { ConnectDbService } from '../connect-db/connect-db.service';

@Injectable()
export class UsersService {
  constructor(private connectDbService: ConnectDbService) {}

  async getAllUsers(data: { id: number; login: string }) {
    return await this.connectDbService.find(data);
  }

  async getUser(data: { id: number; client: { id: number; login: string } }) {
    return await this.connectDbService.findOne(data);
  }

  async updateUser(data: {
    id: number;
    client: { id: number; login: string };
    data: { name: string; age: number };
  }) {
    const user = await this.connectDbService.findOne({
      id: data.id,
      client: data.client,
    });

    if (!user) throw new HttpException('Нету существует', 404);

    return await this.connectDbService.update({ user, data: data.data });
  }

  async createUser(data: {
    client: { id: number; login: string };
    data: { name: string; age: number };
  }) {
    return await this.connectDbService.create(data);
  }

  async deleteUser(data: {
    id: number;
    client: { id: number; login: string };
  }) {
    const user = await this.connectDbService.findOne({
      id: data.id,
      client: data.client,
    });

    if (!user) throw new HttpException('Нету существует', 404);

    return await this.connectDbService.delete(user);
  }
}
