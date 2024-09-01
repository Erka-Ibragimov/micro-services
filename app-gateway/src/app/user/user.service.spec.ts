import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { UserDto } from './dto/user.dto';

describe('UserService', () => {
  let service: UserService;
  let clientProxy: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'USERS_SERVICE',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    clientProxy = module.get<ClientProxy>('USERS_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should get all users', async () => {
      const result = [{ id: 1, name: 'John Doe', age: 18 }];
      jest.spyOn(clientProxy, 'send').mockImplementation(() => of(result));

      expect(await service.getAll({ id: 1, login: 'test' })).toEqual(result);
      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'get_users' },
        { id: 1, login: 'test' },
      );
    });
  });

  describe('getOne', () => {
    it('should get one user', async () => {
      const result = { id: 1, name: 'John Doe', age: 18 };
      jest.spyOn(clientProxy, 'send').mockImplementation(() => of(result));

      expect(await service.getOne({ id: 1, login: 'test' }, 1)).toEqual(result);
      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'get_user' },
        { id: 1, client: { id: 1, login: 'test' } },
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userDto: UserDto = { name: 'Jane Doe', age: 18 };
      const result = { id: 1, name: 'Jane Doe', age: 18 };
      jest.spyOn(clientProxy, 'send').mockImplementation(() => of(result));

      expect(
        await service.update({ id: 1, login: 'test' }, 1, userDto),
      ).toEqual(result);
      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'update_user' },
        { id: 1, client: { id: 1, login: 'test' }, data: userDto },
      );
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const result = { id: 1, name: 'John Doe', age: 18 };
      jest.spyOn(clientProxy, 'send').mockImplementation(() => of(result));

      expect(await service.delete({ id: 1, login: 'test' }, 1)).toEqual(result);
      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'delete_user' },
        { id: 1, client: { id: 1, login: 'test' } },
      );
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const userDto: UserDto = { name: 'Jane Doe', age: 18 };
      const result = { id: 1, name: 'Jane Doe', age: 18 };
      jest.spyOn(clientProxy, 'send').mockImplementation(() => of(result));

      expect(await service.create({ id: 1, login: 'test' }, userDto)).toEqual(
        result,
      );
      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'create_user' },
        { client: { id: 1, login: 'test' }, data: userDto },
      );
    });
  });
});
