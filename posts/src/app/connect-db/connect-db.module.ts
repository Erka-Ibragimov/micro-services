import { Module } from '@nestjs/common';
import { ConnectDbService } from './connect-db.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 25000,
      maxRedirects: 5,
    }),
  ],
  providers: [ConnectDbService],
  exports: [ConnectDbService],
})
export class ConnectDbModule {}
