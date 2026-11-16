import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const requestId = String(response.locals.requestId ?? 'unavailable');

    if (!(exception instanceof HttpException)) {
      this.logger.error({ requestId, exception });
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      status >= HttpStatus.INTERNAL_SERVER_ERROR
        ? 'Internal server error'
        : exception instanceof HttpException
          ? exception.message
          : 'Request failed';

    response.status(status).json({
      code: HttpStatus[status] ?? 'HTTP_ERROR',
      message,
      requestId,
    });
  }
}
