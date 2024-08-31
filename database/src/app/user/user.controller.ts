import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/find')
  async find(@Body() data: { id: number; login: string }) {
    return await this.userService.find(data);
  }

  @Post('/findOne')
  async findOneBy(
    @Body() data: { id: number; client: { id: number; login: string } },
  ) {
    return await this.userService.findOneBy(data);
  }

  @Post('/update')
  async update(
    @Body() data: { user: User; data: { name: string; age: number } },
  ) {
    return await this.userService.update(data);
  }

  @Post('/create')
  async create(
    @Body()
    data: {
      client: { id: number; login: string };
      data: { name: string; age: number };
    },
  ) {
    return await this.userService.create(data);
  }

  @Post('/delete')
  async delete(@Body() user: User) {
    return await this.userService.delete(user);
  }
}
