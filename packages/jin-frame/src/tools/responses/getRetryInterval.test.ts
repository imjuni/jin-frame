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
});
