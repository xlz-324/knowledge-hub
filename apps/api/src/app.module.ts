import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestIdMiddleware } from './common/request-id.middleware.js';
import { SystemModule } from './modules/system/system.module.js';

@Module({
  imports: [SystemModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('{*path}');
  }
}
