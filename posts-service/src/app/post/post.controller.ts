import { Controller, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @MessagePattern({ cmd: 'get_posts' })
  async getAllPosts(
    @Payload() data: { clinet: { id: number; login: string }; userId: number },
  ) {
    return await this.postService.getAllPosts(data);
  }

  @MessagePattern({ cmd: 'get_post' })
  async getPost(
    @Payload()
    data: {
      id: number;
      client: { id: number; login: string };
      userId: number;
    },
  ) {
    return await this.postService.getPost(data);
  }

  @MessagePattern({ cmd: 'update_post' })
  async updatePost(
    @Payload()
    data: {
      id: number;
      client: { id: number; login: string };
      data: { name: string; description: string };
      userId: number;
    },
  ) {
    try {
      return await this.postService.updatePost(data);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern({ cmd: 'create_post' })
  async createPost(
    @Payload()
    data: {
      client: { id: number; login: string };
      data: { name: string; description: string; userId: number };
    },
  ) {
    try {
      return await this.postService.createPost(data);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern({ cmd: 'delete_post' })
  async deletePost(
    @Payload()
    data: {
      id: number;
      client: { id: number; login: string };
      userId: number;
    },
  ) {
    try {
      return await this.postService.deletePost(data);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
