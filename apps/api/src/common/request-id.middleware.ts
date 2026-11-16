import { randomUUID } from 'node:crypto';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export const REQUEST_ID_HEADER = 'x-request-id';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const requestId = randomUUID();
    response.setHeader(REQUEST_ID_HEADER, requestId);
    response.locals.requestId = requestId;
    next();
  }
}
