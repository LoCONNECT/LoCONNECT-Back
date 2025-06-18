(global as any).crypto = require('crypto');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4000'],
    credentials: true,
  });

  await app.listen(process.env.PORT!);
}

bootstrap();
