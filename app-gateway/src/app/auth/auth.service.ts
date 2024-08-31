import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { compare, hash } from 'bcrypt';
import { ConnectDbService } from '../connect-db/connect-db.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private connectDbService: ConnectDbService,
  ) {}

  async register({ login, password }: AuthDto) {
    const existClient = await this.connectDbService.findOneBy(login);

    if (existClient)
      throw new HttpException('Такой пользователь уже существует', 404);

    const hashPassword = await hash(password, 3);

    const newClient = await this.connectDbService.create({
      login,
      password: hashPassword,
    });

    return {
      accessToken: await this.jwtService.signAsync({
        id: newClient.id,
        login: newClient.login,
      }),
    };
  }

  async login({ login, password }: AuthDto) {
    const existClient = await this.connectDbService.findOneBy(login);

    if (!existClient)
      throw new HttpException('Такой пользователь не существует', 404);

    const isPassEquals = await compare(password, existClient.password);

    if (!isPassEquals) throw new HttpException('Не правильный пароль!', 404);

    return {
      accessToken: await this.jwtService.signAsync({
        id: existClient.id,
        login: existClient.login,
      }),
    };
  }
}
