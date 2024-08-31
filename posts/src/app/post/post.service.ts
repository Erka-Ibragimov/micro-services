import { HttpException, Injectable } from '@nestjs/common';
import { ConnectDbService } from '../connect-db/connect-db.service';

@Injectable()
export class PostService {
  constructor(private connectDbService: ConnectDbService) {}

  async getAllPosts(data: {
    clinet: { id: number; login: string };
    userId: number;
  }) {
    return await this.connectDbService.find(data);
  }

  async getPost(data: {
    id: number;
    client: { id: number; login: string };
    userId: number;
  }) {
    return await this.connectDbService.findOne(data);
  }

  async updatePost(data: {
    id: number;
    client: { id: number; login: string };
    data: { name: string; description: string };
    userId: number;
  }) {
    const post = await this.connectDbService.findOne({
      id: data.id,
      userId: data.userId,
      client: data.client,
    });

    if (!post) throw new HttpException('Нету существует', 404);

    return await this.connectDbService.update({ post, data: data.data });
  }

  async createPost(data: {
    client: { id: number; login: string };
    data: { name: string; description: string; userId: number };
  }) {
    return await this.connectDbService.create(data);
  }

  async deletePost(data: {
    id: number;
    client: { id: number; login: string };
    userId: number;
  }) {
    const post = await this.connectDbService.findOne({
      id: data.id,
      userId: data.userId,
      client: data.client,
    });

    if (!post) throw new HttpException('Нету существует', 404);

    return await this.connectDbService.delete(post);
  }
}
