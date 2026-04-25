import { getStatusFromError } from '#tools/responses/getStatusFromError';
import { describe, expect, it } from 'vitest';

describe('getStatusFromError', () => {
  it('should return status from error when error has numeric status property', () => {
    const error = Object.assign(new Error('not found'), { status: 404 });
    const result = getStatusFromError(error);

    expect(result.status).toBe(404);
    expect(result.statusText).toBe('Not Found');
  });

  it('should return 500 when error has status property of non-numeric type', () => {
    const error = Object.assign(new Error('bad'), { status: 'invalid' });
    const result = getStatusFromError(error);

    expect(result.status).toBe(500);
    expect(result.statusText).toBe('Internal Server Error');
  });

  it('should return 500 when error has no status property', () => {
    const result = getStatusFromError(new Error('plain error'));

    expect(result.status).toBe(500);
    expect(result.statusText).toBe('Internal Server Error');
  });

  it('should return 500 when error is not an Error instance', () => {
    const result = getStatusFromError('string error');

    expect(result.status).toBe(500);
    expect(result.statusText).toBe('Internal Server Error');
  });
});
