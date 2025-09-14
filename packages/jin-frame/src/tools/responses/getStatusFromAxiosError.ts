import type { AxiosError } from 'axios';
import httpStatusCodes, { getReasonPhrase } from 'http-status-codes';

export function getStatusFromAxiosError(error: AxiosError): { status: number; statusText: string } {
  if (error.status != null) {
    return {
      status: error.status,
      statusText: getReasonPhrase(error.status),
    };
  }

  const { response } = error;

  if (response == null) {
    return {
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
      statusText: getReasonPhrase(httpStatusCodes.INTERNAL_SERVER_ERROR),
    };
  }

  return {
    status: response.status,
    statusText: response.statusText,
  };
}
