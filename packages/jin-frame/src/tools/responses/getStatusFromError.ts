import httpStatusCodes, { getReasonPhrase } from 'http-status-codes';

export function getStatusFromError(error: unknown): { status: number; statusText: string } {
  if (error instanceof Error && 'status' in error && typeof error.status === 'number') {
    return {
      status: error.status,
      statusText: getReasonPhrase(error.status),
    };
  }

  return {
    status: httpStatusCodes.INTERNAL_SERVER_ERROR,
    statusText: getReasonPhrase(httpStatusCodes.INTERNAL_SERVER_ERROR),
  };
}
