import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConnectDbService } from '../connect-db/connect-db.service';
import { AuthDto } from './dto/auth.dto';
import { HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let connectDbService: ConnectDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConnectDbService,
          useValue: {
            findOneBy: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    connectDbService = module.get<ConnectDbService>(ConnectDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw an error if user already exists', async () => {
      const authDto: AuthDto = { login: 'testUser', password: 'password' };
      jest.spyOn(connectDbService, 'findOneBy').mockResolvedValue({});

      await expect(service.register(authDto)).rejects.toThrowError(
        new HttpException('Такой пользователь уже существует', 404),
      );
    });

    it('should create a new user and return an access token', async () => {
      const authDto: AuthDto = { login: 'newUser', password: 'password' };
      const newUser = { id: 1, login: 'newUser' };

      jest.spyOn(connectDbService, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      jest.spyOn(connectDbService, 'create').mockResolvedValue(newUser);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('accessToken');

      const result = await service.register(authDto);

      expect(result).toEqual({ accessToken: 'accessToken' });
      expect(connectDbService.create).toHaveBeenCalledWith({
        login: authDto.login,
        password: 'hashedPassword',
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        id: newUser.id,
        login: newUser.login,
      });
    });
  });

  describe('login', () => {
    it('should throw an error if user does not exist', async () => {
      const authDto: AuthDto = { login: 'testUser', password: 'password' };
      jest.spyOn(connectDbService, 'findOneBy').mockResolvedValue(null);

      await expect(service.login(authDto)).rejects.toThrowError(
        new HttpException('Такой пользователь не существует', 404),
      );
    });

    it('should throw an error if password is incorrect', async () => {
      const authDto: AuthDto = { login: 'testUser', password: 'password' };
      const existingUser = {
        id: 1,
        login: 'testUser',
        password: 'hashedPassword',
      };

      jest.spyOn(connectDbService, 'findOneBy').mockResolvedValue(existingUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(authDto)).rejects.toThrowError(
        new HttpException('Не правильный пароль!', 404),
      );
    });

    it('should return an access token if login is successful', async () => {
      const authDto: AuthDto = { login: 'testUser', password: 'password' };
      const existingUser = {
        id: 1,
        login: 'testUser',
        password: 'hashedPassword',
      };

      jest.spyOn(connectDbService, 'findOneBy').mockResolvedValue(existingUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('accessToken');

      const result = await service.login(authDto);

      expect(result).toEqual({ accessToken: 'accessToken' });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        id: existingUser.id,
        login: existingUser.login,
      });
    });
  });
});
