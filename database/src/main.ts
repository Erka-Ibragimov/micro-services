import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3008, () => {
    console.log('Listening on port 3008');
  });
}
bootstrap();
