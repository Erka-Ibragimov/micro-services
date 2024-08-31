import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class ConnectDbService {
  constructor(private readonly httpService: HttpService) {}

  async find(data: { id: number; login: string }) {
    const result = await firstValueFrom(
      this.httpService
        .post(
          `http://db:3008/user/find`,
          {
            ...data,
          },
          {
            headers: {
              'Content-type': 'application/json',
            },
          },
        )
        .pipe(
          catchError((error) => {
            if (error instanceof AxiosError) {
              throw new HttpException(
                {
                  error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
                {
                  cause: error,
                },
              );
            }

            throw error;
          }),
        ),
    );

    return result.data;
  }

  async findOne(data: { id: number; client: { id: number; login: string } }) {
    const result = await firstValueFrom(
      this.httpService
        .post(
          `http://db:3008/user/findOne`,
          {
            ...data,
          },
          {
            headers: {
              'Content-type': 'application/json',
            },
          },
        )
        .pipe(
          catchError((error) => {
            if (error instanceof AxiosError) {
              throw new HttpException(
                {
                  error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
                {
                  cause: error,
                },
              );
            }

            throw error;
          }),
        ),
    );

    return result.data;
  }

  async update(data: { user: any; data: { name: string; age: number } }) {
    const result = await firstValueFrom(
      this.httpService
        .post(
          `http://db:3008/user/update`,
          {
            ...data,
          },
          {
            headers: {
              'Content-type': 'application/json',
            },
          },
        )
        .pipe(
          catchError((error) => {
            if (error instanceof AxiosError) {
              throw new HttpException(
                {
                  error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
                {
                  cause: error,
                },
              );
            }

            throw error;
          }),
        ),
    );

    return result.data;
  }

  async create(data: {
    client: { id: number; login: string };
    data: { name: string; age: number };
  }) {
    const result = await firstValueFrom(
      this.httpService
        .post(
          `http://db:3008/user/create`,
          {
            ...data,
          },
          {
            headers: {
              'Content-type': 'application/json',
            },
          },
        )
        .pipe(
          catchError((error) => {
            if (error instanceof AxiosError) {
              throw new HttpException(
                {
                  error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
                {
                  cause: error,
                },
              );
            }

            throw error;
          }),
        ),
    );

    return result.data;
  }

  async delete(data: { user: any }) {
    const result = await firstValueFrom(
      this.httpService
        .post(
          `http://db:3008/user/delete`,
          {
            ...data,
          },
          {
            headers: {
              'Content-type': 'application/json',
            },
          },
        )
        .pipe(
          catchError((error) => {
            if (error instanceof AxiosError) {
              throw new HttpException(
                {
                  error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
                {
                  cause: error,
                },
              );
            }

            throw error;
          }),
        ),
    );

    return result.data;
  }

  async check(token: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get('http://db:3005/auth/check', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .pipe(
          catchError(() => {
            throw new UnauthorizedException();
          }),
        ),
    );

    return data;
  }
}
