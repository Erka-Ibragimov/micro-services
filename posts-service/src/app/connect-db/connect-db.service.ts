import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class ConnectDbService {
  constructor(private readonly httpService: HttpService) {}

  async find(data: { clinet: { id: number; login: string }; userId: number }) {
    const result = await firstValueFrom(
      this.httpService
        .post(
          `http://db:3008/post/find`,
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

  async findOne(data: {
    id: number;
    client: { id: number; login: string };
    userId: number;
  }) {
    const result = await firstValueFrom(
      this.httpService
        .post(
          `http://db:3008/post/findOne`,
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

  async update(data: {
    post: any;
    data: { name: string; description: string };
  }) {
    const result = await firstValueFrom(
      this.httpService
        .post(
          `http://db:3008/post/update`,
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
    data: { name: string; description: string; userId: number };
  }) {
    const result = await firstValueFrom(
      this.httpService
        .post(
          `http://db:3008/post/create`,
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

  async delete(data: { post: any }) {
    const result = await firstValueFrom(
      this.httpService
        .post(
          `http://db:3008/post/delete`,
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
}
