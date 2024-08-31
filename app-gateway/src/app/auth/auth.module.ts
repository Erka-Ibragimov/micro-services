import { Module } from '@nestjs/common';
import { AuthContoller } from './auth.controller';
import { AuthService } from './auth.service';
import { ConnectDbModule } from '../connect-db/connect-db.module';

@Module({
  controllers: [AuthContoller],
  providers: [AuthService],
  imports: [ConnectDbModule],
})
export class AuthModule {}
