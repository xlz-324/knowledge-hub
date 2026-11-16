import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { RequestIdMiddleware } from './request-id.middleware.js';

vi.mock('node:crypto', () => ({
  randomUUID: vi.fn(),
}));

describe('RequestIdMiddleware', () => {
  it('creates a server-side request ID and continues the request', () => {
    const requestId = '5f0c06a9-23f8-4de3-9b2a-54e21c16353e';
    vi.mocked(randomUUID).mockReturnValue(requestId);
    const response = {
      setHeader: vi.fn(),
      locals: {} as Response['locals'],
    };
    const next = vi.fn();

    new RequestIdMiddleware().use(
      {} as Request,
      response as unknown as Response,
      next,
    );

    expect(response.setHeader).toHaveBeenCalledWith('x-request-id', requestId);
    expect(response.locals.requestId).toBe(requestId);
    expect(next).toHaveBeenCalledOnce();
  });
});
