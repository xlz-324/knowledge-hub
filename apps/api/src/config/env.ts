const DEFAULT_PORT = 3000;

export interface AppEnvironment {
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
}

export function loadEnvironment(
  source: Record<string, string | undefined> = process.env,
): AppEnvironment {
  const nodeEnv = source.NODE_ENV ?? 'development';

  if (!['development', 'test', 'production'].includes(nodeEnv)) {
    throw new Error('NODE_ENV must be development, test, or production');
  }

  const port = Number(source.API_PORT ?? DEFAULT_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('API_PORT must be an integer between 1 and 65535');
  }

  return {
    nodeEnv: nodeEnv as AppEnvironment['nodeEnv'],
    port,
  };
}
