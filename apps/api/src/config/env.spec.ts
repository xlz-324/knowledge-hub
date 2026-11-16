import { loadEnvironment } from './env.js';

describe('loadEnvironment', () => {
  it('uses safe local defaults', () => {
    expect(loadEnvironment({})).toEqual({
      nodeEnv: 'development',
      port: 3000,
    });
  });

  it('accepts an explicitly configured port', () => {
    expect(loadEnvironment({ API_PORT: '3100' }).port).toBe(3100);
  });

  it.each(['0', '-1', '3000.5', 'abc', '65536'])(
    'rejects invalid API_PORT %s',
    (port) => {
      expect(() => loadEnvironment({ API_PORT: port })).toThrow('API_PORT');
    },
  );

  it('rejects an unknown environment', () => {
    expect(() => loadEnvironment({ NODE_ENV: 'local' })).toThrow('NODE_ENV');
  });
});
