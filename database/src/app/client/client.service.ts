import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entity/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async findOneBy(login: string) {
    return await this.clientRepository.findOneBy({ login });
  }

  async create(data: { login: string; password: string }) {
    const newClient = this.clientRepository.create({
      login: data.login,
      password: data.password,
    });

    await this.clientRepository.save(newClient, { reload: true });

    return newClient;
  }
}
