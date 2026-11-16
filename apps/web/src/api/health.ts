export interface ReadinessResponse {
  status: 'ok';
  checks: {
    api: 'up';
  };
}

export async function getReadiness(
  signal?: AbortSignal,
): Promise<ReadinessResponse> {
  const response = await fetch('/api/v1/health/ready', {
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Health check failed with HTTP ${response.status}`);
  }

  const body: unknown = await response.json();
  if (
    typeof body !== 'object' ||
    body === null ||
    !('status' in body) ||
    body.status !== 'ok' ||
    !('checks' in body) ||
    typeof body.checks !== 'object' ||
    body.checks === null ||
    !('api' in body.checks) ||
    body.checks.api !== 'up'
  ) {
    throw new Error('Health check returned an unexpected response');
  }

  return body as ReadinessResponse;
}
