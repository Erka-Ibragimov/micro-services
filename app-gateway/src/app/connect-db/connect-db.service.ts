import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class ConnectDbService {
  constructor(private readonly httpService: HttpService) {}

  async findOneBy(login: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`http://db:3008/client/${login}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .pipe(
          catchError((error) => {
            throw new HttpException(error.message, error.status);
          }),
        ),
    );

    return data;
  }

  async create(data: { login: string; password: string }) {
    const result = await firstValueFrom(
      this.httpService
        .post(
          `http://db:3008/client`,
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
