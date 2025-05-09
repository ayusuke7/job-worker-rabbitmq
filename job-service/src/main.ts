/* eslint-disable @typescript-eslint/no-floating-promises */
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3333);
  logger.log(`Seller Job Service is running on: ${await app.getUrl()}`);
}

bootstrap();
