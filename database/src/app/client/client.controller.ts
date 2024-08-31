import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClientService } from './client.service';

@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get('/:login')
  async findOneBy(@Param('login') login: string) {
    return await this.clientService.findOneBy(login);
  }

  @Post()
  async create(@Body() data: { login: string; password: string }) {
    return await this.clientService.create(data);
  }
}
