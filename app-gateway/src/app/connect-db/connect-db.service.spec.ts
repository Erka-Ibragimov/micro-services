import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConnectDbService } from './connect-db.service';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ConnectDbService', () => {
  let service: ConnectDbService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectDbService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ConnectDbService>(ConnectDbService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneBy', () => {
    it('should return user data', async () => {
      const login = 'testUser';
      const result = { id: 1, login: 'testUser' };
      const axiosResponse: AxiosResponse = {
        data: result,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: null,
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));

      expect(await service.findOneBy(login)).toEqual(result);
      expect(httpService.get).toHaveBeenCalledWith(
        `http://db:3008/client/${login}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    });

    it('should throw an HttpException if an error occurs', async () => {
      const login = 'testUser';
      const errorMessage = 'Something went wrong';
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(
          throwError(
            () => new HttpException(errorMessage, HttpStatus.BAD_REQUEST),
          ),
        );

      await expect(service.findOneBy(login)).rejects.toThrowError(
        new HttpException(errorMessage, HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('create', () => {
    it('should create a user and return data', async () => {
      const data = { login: 'testUser', password: 'password' };
      const result = { id: 1, login: 'testUser' };
      const axiosResponse: AxiosResponse = {
        data: result,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: null,
      };

      jest.spyOn(httpService, 'post').mockReturnValue(of(axiosResponse));

      expect(await service.create(data)).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith(
        `http://db:3008/client`,
        data,
        {
          headers: {
            'Content-type': 'application/json',
          },
        },
      );
    });

    it('should rethrow non-Axios errors', async () => {
      const data = { login: 'testUser', password: 'password' };
      const nonAxiosError = new Error('Non-Axios error');

      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(throwError(() => nonAxiosError));

      await expect(service.create(data)).rejects.toThrow(nonAxiosError);
    });
  });
});
