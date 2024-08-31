import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { AppService } from './app.service';
import { Client } from './client/entity/client.entity';
import { User } from './user/entity/user.entity';
import { ClientModule } from './client/client.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { Post } from './post/entity/post.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('postgres.host'),
        port: Number(configService.get('postgres.port')),
        username: configService.get('postgres.username'),
        password: configService.get('postgres.password'),
        database: configService.get('postgres.database'),
        entities: [User, Post, Client],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ClientModule,
    UserModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
