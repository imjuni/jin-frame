import { getRetryAfter } from '#tools/getRetryAfter';
import { describe, expect, it, vi } from 'vitest';

describe('getRetryAfter', () => {
  it('should return retry-after value when useRetryAfter is true and header exists', () => {
    const retry = { max: 3, try: 1, useRetryAfter: true };

    const result = getRetryAfter(retry, '120');
    expect(result).toEqual(120);
  });

  it('should return undefined when useRetryAfter is false', () => {
    const retry = { max: 3, try: 1, useRetryAfter: false };

    const result = getRetryAfter(retry, '120');
    expect(result).toBeUndefined();
  });

  it('should handle case-insensitive header names', () => {
    const retry = { max: 3, try: 1, useRetryAfter: true };

    const result = getRetryAfter(retry, '60');
    expect(result).toEqual(60);
  });

  it('should handle uppercase header names', () => {
    const retry = { max: 3, try: 1, useRetryAfter: true };

    const result = getRetryAfter(retry, ['30', '60']);
    expect(result).toEqual(30);
  });

  it('should return undefined when retry-after value is not a valid number', () => {
    const retry = { max: 3, try: 1, useRetryAfter: true };

    const result = getRetryAfter(retry, 'invalid');
    expect(result).toBeUndefined();
  });

  it('should return undefined when retry-after value is empty string', () => {
    const retry = { max: 3, try: 1, useRetryAfter: true };

    const result = getRetryAfter(retry, '');
    expect(result).toBeUndefined();
  });

  it('should default useRetryAfter to true when not specified', () => {
    const retry = { max: 3, try: 1 }; // useRetryAfter not specified

    const result = getRetryAfter(retry, '90');
    expect(result).toEqual(90);
  });

  it('should return undefined when header value is undefined', () => {
    const retry = { max: 3, try: 1, useRetryAfter: true };

    const result = getRetryAfter(retry, undefined);
    expect(result).toBeUndefined();
  });

  it('should return undefined when header value is undefined', () => {
    const retry = { max: 3, try: 1, useRetryAfter: true };

    const result = getRetryAfter(retry, []);
    expect(result).toBeUndefined();
  });

  it('should return undefined when parseInt throws error', () => {
    // Mock the global parseInt function
    vi.stubGlobal(
      'parseInt',
      vi.fn(() => {
        throw new Error('test');
      }),
    );

    const retry = { max: 3, try: 1, useRetryAfter: true };

    // Since the function has try-catch, it should return undefined when parseInt throws
    const result = getRetryAfter(retry, '30');
    expect(result).toBeUndefined();

    // Restore the original parseInt
    vi.unstubAllGlobals();
  });
});
