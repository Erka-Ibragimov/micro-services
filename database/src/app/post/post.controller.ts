import { Body, Controller, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as Postt } from './entity/post.entity';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('/find')
  async find(
    @Body() data: { client: { id: number; login: string }; userId: number },
  ) {
    console.log('here2');
    return await this.postService.find(data);
  }

  @Post('/findOne')
  async findOneBy(
    @Body()
    data: {
      id: number;
      client: { id: number; login: string };
      userId: number;
    },
  ) {
    return await this.postService.findOneBy(data);
  }

  @Post('/update')
  async update(
    @Body() data: { post: Postt; data: { name: string; description: string } },
  ) {
    return await this.postService.update(data);
  }

  @Post('/create')
  async create(
    @Body()
    data: {
      client: { id: number; login: string };
      data: { name: string; description: string; userId: number };
    },
  ) {
    return await this.postService.create(data);
  }

  @Post('/delete')
  async delete(@Body() post: Postt) {
    return await this.postService.delete(post);
  }
}
