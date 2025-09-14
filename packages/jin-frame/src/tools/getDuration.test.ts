import { getDuration } from '#tools/getDuration';
import { describe, expect, it, vitest } from 'vitest';

describe('getDuration', () => {
  it('duration', () => {
    const s = new Date(2023, 0, 10, 0, 0, 0, 0);
    const e = new Date(2023, 0, 10, 0, 0, 10, 0);

    const d = getDuration(s, e);

    expect(d).toEqual(10000);
  });

  it('duration - milliseconds', () => {
    const s = new Date(2023, 0, 10, 0, 0, 0, 0);
    const e = new Date(2023, 0, 10, 0, 0, 0, 200);

    const d = getDuration(s, e);

    expect(d).toEqual(200);
  });

  it('duration - second + milliseconds', () => {
    const s = new Date(2023, 0, 10, 0, 0, 0, 0);
    const e = new Date(2023, 0, 10, 0, 0, 1, 200);

    const d = getDuration(s, e);

    expect(d).toEqual(1200);
  });

  it('duration - second + milliseconds', () => {
    const s = new Date(2023, 0, 10, 0, 0, 0, 0);
    const e = new Date(2023, 0, 10, 0, 1, 1, 312);

    const d = getDuration(s, e);

    expect(d).toEqual(61312);
  });

  it('duration - minutes + second + milliseconds', () => {
    const s = new Date(2023, 0, 10, 0, 0, 0, 0);
    const e = new Date(2023, 0, 10, 2, 1, 1, 312);

    const d = getDuration(s, e);

    expect(d).toEqual(7261312);
  });

  it('exception - start', () => {
    const s = new Date(2023, 0, 10, 0, 0, 0, 0);
    const e = new Date(NaN);

    const d = getDuration(s, e);

    expect(d).toEqual(-1);
  });

  it('exception - end', () => {
    const s = new Date(NaN);
    const e = new Date(2023, 0, 1, 0, 0, 0, 0);

    const d = getDuration(s, e);

    expect(d).toEqual(-1);
  });

  it('exception', () => {
    const spy = vitest.spyOn(Number, 'isNaN').mockImplementationOnce(() => {
      throw new Error('raise Error');
    });

    const start = new Date(Date.UTC(2023, 3, 24, 10, 0, 0, 999));
    const end = new Date(Date.UTC(2023, 3, 24, 11, 0, 0, 0));
    const duration = getDuration(start, end);

    spy.mockRestore();

    expect(duration).toEqual(-1);
  });
});
