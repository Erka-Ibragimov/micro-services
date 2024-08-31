import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { ConnectDbModule } from '../connect-db/connect-db.module';

@Module({
  imports: [ConnectDbModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
