import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';
import { Auth, IAuth } from 'src/common/auth.decorator';

@Controller('auth')
export class AuthContoller {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() data: AuthDto) {
    return await this.authService.register(data);
  }

  @Post('/login')
  async login(@Body() data: AuthDto) {
    return await this.authService.login(data);
  }

  @UseGuards(AuthGuard)
  @Get('/check')
  async check(@Auth() auth: IAuth) {
    return auth;
  }
}
