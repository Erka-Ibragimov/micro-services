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
import { AuthGuard } from '../auth/auth.guard';
import { Auth, IAuth } from 'src/common/auth.decorator';
import { UserService } from './user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { UserDto } from './dto/user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAll(@Req() request: Request, @Auth() auth: IAuth) {
    const value = await this.cacheManager.get(`user:${request.url}`);

    if (value) return JSON.parse(value as string);

    const result = await this.userService.getAll(auth);

    await this.cacheManager.set(`user:${request.url}`, JSON.stringify(result));

    return result;
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
    @Auth() auth: IAuth,
  ) {
    const value = await this.cacheManager.get(`user:${request.url}`);

    if (value) return JSON.parse(value as string);

    const result = await this.userService.getOne(auth, id);

    await this.cacheManager.set(`user:${request.url}`, JSON.stringify(result));

    return result;
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Auth() auth: IAuth,
    @Body() data: UserDto,
  ) {
    try {
      const result = await this.userService.update(auth, id, data);

      const keys = await this.cacheManager.store.keys('user:*');

      keys.forEach((key) => this.cacheManager.del(key));

      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number, @Auth() auth: IAuth) {
    try {
      const result = await this.userService.delete(auth, id);

      const keys = await this.cacheManager.store.keys('user:*');

      keys.forEach((key) => this.cacheManager.del(key));

      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Auth() auth: IAuth, @Body() data: UserDto) {
    const keys = await this.cacheManager.store.keys('user:*');

    keys.forEach((key) => this.cacheManager.del(key));

    return await this.userService.create(auth, data);
  }
}
