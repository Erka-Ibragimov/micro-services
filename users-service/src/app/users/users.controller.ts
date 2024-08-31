import { Body, Controller, Delete, Get, HttpException, Inject, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Guard } from 'src/guard/guard';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @MessagePattern({ cmd: 'get_users' })
  async getAllUsers(@Payload() data: { id: number; login: string }) {
    return await this.userService.getAllUsers(data);
  }

  @MessagePattern({ cmd: 'get_user' })
  async getUser(
    @Payload() data: { id: number; client: { id: number; login: string } },
  ) {
    return await this.userService.getUser(data);
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUser(
    @Payload()
    data: {
      id: number;
      client: { id: number; login: string };
      data: { name: string; age: number };
    },
  ) {
    try {
      return await this.userService.updateUser(data);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(
    @Payload()
    data: {
      client: { id: number; login: string };
      data: { name: string; age: number };
    },
  ) {
    try {
      return await this.userService.createUser(data);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern({ cmd: 'delete_user' })
  async deleteUser(
    @Payload()
    data: {
      id: number;
      client: { id: number; login: string };
    },
  ) {
    try {
      return await this.userService.deleteUser(data);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(Guard)
  @Get()
  async getAll(@Req() request: Request) {
    const value = await this.cacheManager.get(`user:${request.url}`);

    if (value) return JSON.parse(value as string);

    const result = await this.userService.getAllUsers(request['user']);

    await this.cacheManager.set(`user:${request.url}`, JSON.stringify(result));

    return result;
  }

  @UseGuards(Guard)
  @Get('/:id')
  async getOne(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const value = await this.cacheManager.get(`user:${request.url}`);

    if (value) return JSON.parse(value as string);

    const result = await this.userService.getUser({
      id,
      client: request['user'],
    });

    await this.cacheManager.set(`user:${request.url}`, JSON.stringify(result));

    return result;
  }

  @UseGuards(Guard)
  @Patch('/:id')
  async update(
    @Req() request: Request,
    @Body() data: UserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const result = await this.userService.updateUser({
        id,
        client: request['user'],
        data,
      });

      const keys = await this.cacheManager.store.keys('user:*');

      keys.forEach((key) => this.cacheManager.del(key));

      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @UseGuards(Guard)
  @Post()
  async create(@Req() request: Request, @Body() data: UserDto) {
    const keys = await this.cacheManager.store.keys('user:*');

    keys.forEach((key) => this.cacheManager.del(key));

    return this.userService.createUser({ client: request['user'], data });
  }

  @UseGuards(Guard)
  @Delete('/id')
  async delete(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.userService.deleteUser({
        id,
        client: request['user'],
      });

      const keys = await this.cacheManager.store.keys('user:*');

      keys.forEach((key) => this.cacheManager.del(key));

      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
