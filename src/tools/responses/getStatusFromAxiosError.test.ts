import { getStatusFromAxiosError } from '#tools/responses/getStatusFromAxiosError';
import httpStatusCodes, { getReasonPhrase } from 'http-status-codes';
import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';

describe('getStatusFromAxiosError', () => {
  it('should return not round error when empty response', () => {
    const error = new AxiosError();
    error.status = httpStatusCodes.NOT_FOUND;

    const { status, statusText } = getStatusFromAxiosError(error);

    expect(status).toEqual(httpStatusCodes.NOT_FOUND);
    expect(statusText).toEqual(getReasonPhrase(httpStatusCodes.NOT_FOUND));
  });

  it('should return internal server error when empty response', () => {
    const error = new AxiosError();
    const { status, statusText } = getStatusFromAxiosError(error);

    expect(status).toEqual(httpStatusCodes.INTERNAL_SERVER_ERROR);
    expect(statusText).toEqual(getReasonPhrase(httpStatusCodes.INTERNAL_SERVER_ERROR));
  });

  it('should return unauthorized erorr when response status unauthorized', () => {
    const error = new AxiosError();
    error.response = {
      status: httpStatusCodes.UNAUTHORIZED,
      statusText: getReasonPhrase(httpStatusCodes.UNAUTHORIZED),
    } as unknown as any;
    const { status, statusText } = getStatusFromAxiosError(error);

    expect(status).toEqual(httpStatusCodes.UNAUTHORIZED);
    expect(statusText).toEqual(getReasonPhrase(httpStatusCodes.UNAUTHORIZED));
  });
});
