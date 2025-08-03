import { JinFrame } from '#frames/JinFrame';
import type { TJinRequestConfig } from '#interfaces/TJinFrameResponse';
import type { AxiosResponse } from 'axios';
import nock from 'nock';
import { afterEach, describe, expect, it } from 'vitest';

class RetryTestGet01Frame extends JinFrame {
  @JinFrame.P()
  public declare readonly passing: string;

  @JinFrame.Q()
  public declare readonly name: string;

  @JinFrame.Q({ encode: true })
  public declare readonly skill: string[];

  constructor() {
    super({
      $$host: 'http://some.api.google.com',
      $$path: '/jinframe/:passing',
      $$method: 'get',
      $$retry: { max: 3, interval: 20 },
    });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];
  }
}

class RetryTestGet02Frame extends JinFrame {
  @JinFrame.P()
  public declare readonly passing: string;

  @JinFrame.Q()
  public declare readonly name: string;

  @JinFrame.Q({ encode: true })
  public declare readonly skill: string[];

  #retryFail: string;

  get retryFail() {
    return this.#retryFail;
  }

  $$retryFailHook<TDATA>(req: TJinRequestConfig, res: AxiosResponse<TDATA, any>): void | Promise<void> {
    this.#retryFail = res.data as string;

    console.log(req.url);
    console.log(res.data);
  }

  constructor() {
    super({
      $$host: 'http://some.api.google.com',
      $$path: '/jinframe/:passing',
      $$method: 'get',
      $$retry: { max: 2 },
    });

    this.#retryFail = '';
    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];
  }
}

describe('TestGet9Frame', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('retry - getter', () => {
    const frame = new RetryTestGet01Frame();
    expect(frame.$$retry?.max).toEqual(3);
    expect(frame.$$retry?.interval).toEqual(20);
  });

  it('retry - setter', () => {
    const frame = new RetryTestGet01Frame();
    frame.$$retry = { max: 10, interval: 100, try: 1 };
    expect(frame.$$retry?.max).toEqual(10);
    expect(frame.$$retry?.try).toEqual(1);
    expect(frame.$$retry?.interval).toEqual(100);
  });

  it('under retry count', async () => {
    nock('http://some.api.google.com')
      .get('/jinframe/pass?name=ironman&skill=beam&skill=flying%21')
      .times(2)
      .reply(500, 'Internal Server Error')
      .get('/jinframe/pass?name=ironman&skill=beam&skill=flying%21')
      .reply(200, {
        message: 'hello',
      });

    const frame = new RetryTestGet01Frame();

    const resp = await frame.execute();
    expect(resp.status < 400).toEqual(true);
    expect(frame.$$retry?.try).toEqual(1);
  });

  it('over retry count', async () => {
    nock('http://some.api.google.com')
      .get('/jinframe/pass?name=ironman&skill=beam&skill=flying%21')
      .times(5)
      .reply(500, 'Internal Server Error')
      .get('/jinframe/pass?name=ironman&skill=beam&skill=flying%21')
      .reply(200, {
        message: 'hello',
      });

    const frame = new RetryTestGet01Frame();

    await expect(async () => {
      await frame.execute();
    }).rejects.toThrowError();

    console.log(frame.$$retry);
  });

  it('retry with hook', async () => {
    const errorMessage = 'Internal Server Error';
    nock('http://some.api.google.com')
      .get('/jinframe/pass?name=ironman&skill=beam&skill=flying%21')
      .times(4)
      .reply(500, errorMessage)
      .get('/jinframe/pass?name=ironman&skill=beam&skill=flying%21')
      .reply(200, {
        message: 'hello',
      });

    const frame = new RetryTestGet02Frame();

    await expect(async () => {
      await frame.execute();
    }).rejects.toThrowError();

    console.log('A: ', frame.$$retry, frame.retryFail);

    expect(frame.retryFail).toEqual(errorMessage);
  });
});
