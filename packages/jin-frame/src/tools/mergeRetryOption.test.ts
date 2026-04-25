import { describe, expect, it } from 'vitest';
import { mergeRetryOption } from '#tools/mergeRetryOption';
import type { FrameRetry } from '#interfaces/options/FrameRetry';

describe('mergeRetryOption', () => {
  it('should override existing property when next has same property', () => {
    const prev: FrameRetry = { max: 1 };
    const next: FrameRetry = { max: 2 };

    const merged = mergeRetryOption(prev, next);

    expect(merged).toEqual({ max: 2 });
  });

  it('should preserve prev properties when next does not have those properties', () => {
    const prev: FrameRetry = { max: 1, interval: 1000 };
    const next: FrameRetry = { max: 2 };

    const merged = mergeRetryOption(prev, next);

    expect(merged).toEqual({ max: 2, interval: 1000 });
  });

  it('should override all properties when next has all properties', () => {
    const prev: FrameRetry = { max: 1, interval: 1000 };
    const next: FrameRetry = { max: 2, interval: 2000 };

    const merged = mergeRetryOption(prev, next);

    expect(merged).toEqual({ max: 2, interval: 2000 });
  });

  it('should merge getInterval function when next provides getInterval callback', () => {
    const getInterval = () => 1000;
    const prev: FrameRetry = { max: 1, interval: 1000 };
    const next: FrameRetry = { max: 2, getInterval };

    const merged = mergeRetryOption(prev, next);

    expect(merged).toEqual({ max: 2, interval: 1000, getInterval });
  });

  it('should merge useRetryAfter when next provides useRetryAfter', () => {
    const prev: FrameRetry = { max: 1, interval: 1000 };
    const next: FrameRetry = { max: 2, useRetryAfter: false };

    const merged = mergeRetryOption(prev, next);

    expect(merged).toEqual({ max: 2, interval: 1000, useRetryAfter: false });
  });
});
