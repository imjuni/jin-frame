import { JinRequestError } from '#exceptions/JinRequestError';
import { getDuration } from '#tools/getDuration';
import { getReasonPhrase } from 'http-status-codes';
import { describe, expect, it } from 'vitest';

describe('JinRequestError', () => {
  it('gettter/setter', () => {
    const jf = new JinRequestError({
      debug: {
        ts: {
          unix: '1674349200',
          iso: '1674349200',
        },
        duration: getDuration(new Date(2023, 0, 1, 0, 0, 1), new Date(2023, 0, 1, 0, 0, 2)),
        isDeduped: false,
        req: {} as any,
      },
      resp: {
        status: 500,
        statusText: getReasonPhrase(500),
      } as any,
      frame: {} as any,
      message: 'error',
    });

    expect(jf.debug).toMatchObject({
      ts: {
        unix: '1674349200',
        iso: '1674349200',
      },
      duration: 1000,
      req: {},
    });

    expect(jf.frame).toMatchObject({});
    expect(jf.resp).toMatchObject({});
    expect(jf.status).toEqual(500);
    expect(jf.statusText).toEqual(getReasonPhrase(500));
    expect(jf.message).toEqual('error');
  });
});
