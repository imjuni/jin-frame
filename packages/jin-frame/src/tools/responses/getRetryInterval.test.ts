import { getRetryInterval } from '#tools/responses/getRetryInterval';
import { describe, expect, it } from 'vitest';

describe('getRetryInterval', () => {
  it('should return finxed interval when getInterval is null', () => {
    const result = getRetryInterval(
      {
        interval: 100,
        max: 10,
        try: 1,
      },
      1000,
      1000,
    );

    expect(result).toEqual(100);
  });

  it('should return finxed interval when getInterval is passed', () => {
    const result = getRetryInterval(
      {
        getInterval: (retry: number, totalDuration: number, _eachDuration: number) => {
          if (totalDuration > 10000) {
            return 200;
          }

          return retry * 500;
        },
        max: 10,
        try: 3,
      },
      1000,
      1000,
    );

    expect(result).toEqual(1500);
  });

  it('should return default interval when getInterval, interval not passed', () => {
    const result = getRetryInterval(
      {
        max: 10,
        try: 3,
      },
      1000,
      1000,
    );

    expect(result).toEqual(1000);
  });

  it('should return retry-after value in milliseconds when provided and useRetryAfter is true', () => {
    const result = getRetryInterval(
      {
        max: 10,
        try: 1,
        interval: 500,
        useRetryAfter: true,
      },
      1000,
      1000,
      120, // 120 seconds
    );

    expect(result).toEqual(120000); // 120 * 1000 = 120000ms
  });

  it('should prioritize retry-after over getInterval when useRetryAfter is true', () => {
    const result = getRetryInterval(
      {
        max: 10,
        try: 2,
        getInterval: (retry) => retry * 100,
        useRetryAfter: true,
      },
      1000,
      1000,
      60,
    );

    expect(result).toEqual(60000); // Retry-After takes priority
  });

  it('should use getInterval when retry-after is null and useRetryAfter is true', () => {
    const result = getRetryInterval(
      {
        max: 10,
        try: 2,
        getInterval: (retry) => retry * 100,
        useRetryAfter: true,
      },
      1000,
      1000,
      undefined,
    );

    expect(result).toEqual(200); // falls back to getInterval
  });
});
