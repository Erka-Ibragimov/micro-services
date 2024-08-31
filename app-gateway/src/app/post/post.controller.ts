import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Auth, IAuth } from 'src/common/auth.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { PostDto } from './dto/post.dto';

@Controller('post')
export class PostController {
  constructor(
    readonly postService: PostService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/:userId')
  async getAll(
    @Req() request: Request,
    @Auth() auth: IAuth,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    const value = await this.cacheManager.get(`post:${request.url}`);

    if (value) return JSON.parse(value as string);

    const result = await this.postService.getAll(auth, userId);

    await this.cacheManager.set(`post:${request.url}`, JSON.stringify(result));

    return result;
  }

  @UseGuards(AuthGuard)
  @Get('/:userId/:id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Req() request: Request,
    @Auth() auth: IAuth,
  ) {
    console.log('here3')
    const value = await this.cacheManager.get(`post:${request.url}`);

    if (value) return JSON.parse(value as string);

    const result = await this.postService.getOne(auth, id, userId);

    await this.cacheManager.set(`post:${request.url}`, JSON.stringify(result));

    return result;
  }

  @UseGuards(AuthGuard)
  @Patch('/:userId/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Auth() auth: IAuth,
    @Body() data: PostDto,
  ) {
    try {
      const result = await this.postService.update(auth, id, data, userId);

      const keys = await this.cacheManager.store.keys('post:*');

      keys.forEach((key) => this.cacheManager.del(key));

      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:userId/:id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Auth() auth: IAuth,
  ) {
    try {
      const result = await this.postService.delete(auth, id, userId);

      const keys = await this.cacheManager.store.keys('post:*');

      keys.forEach((key) => this.cacheManager.del(key));

      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Auth() auth: IAuth, @Body() data: PostDto) {
    const keys = await this.cacheManager.store.keys('post:*');

    keys.forEach((key) => this.cacheManager.del(key));

    return await this.postService.create(auth, data);
  }
}
