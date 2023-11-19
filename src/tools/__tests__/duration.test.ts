import { getDuration } from '#tools/getDuration';
import { describe, expect, it, vi } from 'vitest';

describe('getDuration', () => {
  it('diff milliseconds', () => {
    const start = new Date(Date.UTC(2023, 3, 24, 10, 0, 0, 999));
    const end = new Date(Date.UTC(2023, 3, 24, 10, 0, 1, 0));
    const duration = getDuration(start, end);

    console.log('duration: ', duration);
    expect(duration).toEqual(1);
  });

  it('diff seconds', () => {
    const start = new Date(Date.UTC(2023, 3, 24, 10, 0, 0, 999));
    const end = new Date(Date.UTC(2023, 3, 24, 10, 0, 2, 0));
    const duration = getDuration(start, end);

    console.log('duration: ', duration);
    expect(duration).toEqual(1001);
  });

  it('diff minutes', () => {
    const start = new Date(Date.UTC(2023, 3, 24, 10, 0, 0, 999));
    const end = new Date(Date.UTC(2023, 3, 24, 10, 1, 0, 0));
    const duration = getDuration(start, end);

    console.log('duration: ', duration);
    expect(duration).toEqual(59001);
  });

  it('diff hours', () => {
    const start = new Date(Date.UTC(2023, 3, 24, 10, 0, 0, 999));
    const end = new Date(Date.UTC(2023, 3, 24, 11, 0, 0, 0));
    const duration = getDuration(start, end);

    console.log('duration: ', duration);
    expect(duration).toEqual(3599001);
  });

  it('exception', () => {
    const spy = vi.spyOn(Number, 'isNaN').mockImplementationOnce(() => {
      throw new Error('raise Error');
    });

    const start = new Date(Date.UTC(2023, 3, 24, 10, 0, 0, 999));
    const end = new Date(Date.UTC(2023, 3, 24, 11, 0, 0, 0));
    const duration = getDuration(start, end);

    console.log('duration: ', duration);
    spy.mockRestore();

    expect(duration).toEqual(-1);
  });
});
