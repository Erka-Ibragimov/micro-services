import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { IAuth } from 'src/common/auth.decorator';
import { PostDto } from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(
    @Inject('POSTS_SERVICE') private readonly clientMQ: ClientProxy,
  ) {}

  async getAll(client: IAuth, userId: number) {
    return await firstValueFrom(
      this.clientMQ
        .send({ cmd: 'get_posts' }, { client, userId })
        .pipe(timeout(5000)),
    );
  }

  async getOne(client: IAuth, id: number, userId: number) {
    return await firstValueFrom(
      this.clientMQ
        .send({ cmd: 'get_post' }, { id, client, userId })
        .pipe(timeout(5000)),
    );
  }

  async update(client: IAuth, id: number, data: PostDto, userId: number) {
    return await firstValueFrom(
      this.clientMQ
        .send({ cmd: 'update_post' }, { id, client, data, userId })
        .pipe(timeout(5000)),
    );
  }

  async delete(client: IAuth, id: number, userId: number) {
    return await firstValueFrom(
      this.clientMQ
        .send({ cmd: 'delete_post' }, { id, client, userId })
        .pipe(timeout(5000)),
    );
  }

  async create(client: IAuth, data: PostDto) {
    return await firstValueFrom(
      this.clientMQ
        .send({ cmd: 'create_post' }, { client, data })
        .pipe(timeout(5000)),
    );
  }
}
