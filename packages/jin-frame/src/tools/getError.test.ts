import { JinCreateError } from '#frames/JinCreateError';
import { getError } from '#tools/getError';
import { describe, expect, it } from 'vitest';

describe('getError', () => {
  it('should return error when handler is not provided', () => {
    const error = new JinCreateError({
      debug: {
        ts: {
          unix: '1674349200',
          iso: '1674349200',
        },
        duration: 1000,
      },
      frame: {} as any,
      message: 'test',
    });

    const result = getError(error);
    expect(result).toBe(error);
  });

  it('should return error when handler is not provided', () => {
    const error = new JinCreateError({
      debug: {
        ts: {
          unix: '1674349200',
          iso: '1674349200',
        },
        duration: 1000,
      },
      frame: {} as any,
      message: 'test',
    });

    const expectation = new Error(error.message);
    const result = getError(error, () => expectation);
    expect(result).toBe(expectation);
  });
});
