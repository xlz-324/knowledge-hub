import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/http-exception.filter.js';
import { loadEnvironment } from './config/env.js';

async function bootstrap() {
  const config = loadEnvironment();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(config.port);
}

await bootstrap();
