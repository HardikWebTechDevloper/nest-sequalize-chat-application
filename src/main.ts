import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  let port = parseInt(process.env.PORT, 10) || 4000;
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors();

  await app.listen(port);
}
bootstrap();
