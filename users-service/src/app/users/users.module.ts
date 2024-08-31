import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConnectDbModule } from '../connect-db/connect-db.module';

@Module({
  imports: [ConnectDbModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
