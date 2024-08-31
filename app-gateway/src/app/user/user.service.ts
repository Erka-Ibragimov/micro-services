import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { IAuth } from 'src/common/auth.decorator';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USERS_SERVICE') private readonly clientMQ: ClientProxy,
  ) {}

  async getAll(client: IAuth) {
    return await firstValueFrom(
      this.clientMQ.send({ cmd: 'get_users' }, client).pipe(timeout(5000)),
    );
  }

  async getOne(client: IAuth, id: number) {
    return await firstValueFrom(
      this.clientMQ
        .send({ cmd: 'get_user' }, { id, client })
        .pipe(timeout(5000)),
    );
  }

  async update(client: IAuth, id: number, data: UserDto) {
    return await firstValueFrom(
      this.clientMQ
        .send({ cmd: 'update_user' }, { id, client, data })
        .pipe(timeout(5000)),
    );
  }

  async delete(client: IAuth, id: number) {
    return await firstValueFrom(
      this.clientMQ
        .send({ cmd: 'delete_user' }, { id, client })
        .pipe(timeout(5000)),
    );
  }

  async create(client: IAuth, data: UserDto) {
    return await firstValueFrom(
      this.clientMQ
        .send({ cmd: 'create_user' }, { client, data })
        .pipe(timeout(5000)),
    );
  }
}
