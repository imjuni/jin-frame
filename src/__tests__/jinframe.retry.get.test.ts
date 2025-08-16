import { JinFrame } from '#frames/JinFrame';
import type { TJinRequestConfig } from '#interfaces/TJinFrameResponse';
import { Get } from '#tools/decorators/methods/Get';
import type { AxiosResponse } from 'axios';
import nock from 'nock';
import { afterEach, describe, expect, it } from 'vitest';

@Get({ host: 'http://some.api.google.com/jinframe/:passing', retry: { max: 3, interval: 20 } })
class RetryTestGet01Frame extends JinFrame {
  @JinFrame.P()
  declare public readonly passing: string;

  @JinFrame.Q()
  declare public readonly name: string;

  @JinFrame.Q({ encode: true })
  declare public readonly skill: string[];

  constructor() {
    super({
      passing: 'pass',
      name: 'ironman',
      skill: ['beam', 'flying!'],
    });
  }

  get retryData() {
    return this.$_data.retry;
  }

  set retryData(value) {
    this.$_data.retry = value;
  }
}

@Get({ host: 'http://some.api.google.com/jinframe/:passing', retry: { max: 2 } })
class RetryTestGet02Frame extends JinFrame {
  @JinFrame.P()
  declare public readonly passing: string;

  @JinFrame.Q()
  declare public readonly name: string;

  @JinFrame.Q({ encode: true })
  declare public readonly skill: string[];

  #retryFail: string;

  get retryFail() {
    return this.#retryFail;
  }

  get retryData() {
    return this.$_data.retry;
  }

  override $_retryFail<TDATA>(req: TJinRequestConfig, res: AxiosResponse<TDATA>): void | Promise<void> {
    this.#retryFail = res.data as string;

    console.log(req.url);
    console.log(res.data);
  }

  constructor() {
    super({
      passing: 'pass',
      name: 'ironman',
      skill: ['beam', 'flying!'],
    });

    this.#retryFail = '';
  }
}

describe('TestGet9Frame', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('retry - getter', () => {
    const frame = new RetryTestGet01Frame();
    expect(frame.retryData?.max).toEqual(3);
    expect(frame.retryData?.interval).toEqual(20);
  });

  it('retry - setter', () => {
    const frame = new RetryTestGet01Frame();
    frame.retryData = { max: 10, interval: 100, try: 1 };
    expect(frame.retryData?.max).toEqual(10);
    expect(frame.retryData?.try).toEqual(1);
    expect(frame.retryData?.interval).toEqual(100);
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
    expect(frame.retryData?.try).toEqual(1);
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

    console.log(frame.retryData);
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

    console.log('A: ', frame.retryData, frame.retryFail);

    expect(frame.retryFail).toEqual(errorMessage);
  });
});
