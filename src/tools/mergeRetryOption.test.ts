import { describe, expect, it } from 'vitest';
import { mergeRetryOption } from '#tools/mergeRetryOption';
import type { IFrameRetry } from '#interfaces/options/IFrameRetry';

describe('mergeRetryOption', () => {
  it('should override existing property when next has same property', () => {
    const prev: IFrameRetry = { max: 1 };
    const next: IFrameRetry = { max: 2 };

    const merged = mergeRetryOption(prev, next);

    expect(merged).toEqual({ max: 2 });
  });

  it('should preserve prev properties when next does not have those properties', () => {
    const prev: IFrameRetry = { max: 1, interval: 1000 };
    const next: IFrameRetry = { max: 2 };

    const merged = mergeRetryOption(prev, next);

    expect(merged).toEqual({ max: 2, interval: 1000 });
  });

  it('should override all properties when next has all properties', () => {
    const prev: IFrameRetry = { max: 1, interval: 1000 };
    const next: IFrameRetry = { max: 2, interval: 2000 };

    const merged = mergeRetryOption(prev, next);

    expect(merged).toEqual({ max: 2, interval: 2000 });
  });

  it('should merge getInterval function when next provides getInterval callback', () => {
    const getInterval = () => 1000;
    const prev: IFrameRetry = { max: 1, interval: 1000 };
    const next: IFrameRetry = { max: 2, getInterval };

    const merged = mergeRetryOption(prev, next);

    expect(merged).toEqual({ max: 2, interval: 1000, getInterval });
  });
});
