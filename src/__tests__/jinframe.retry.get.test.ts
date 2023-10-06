import { JinFrame } from '#frames/JinFrame';
import nock from 'nock';

class RetryTestGet01Frame extends JinFrame {
  @JinFrame.P()
  public readonly passing: string;

  @JinFrame.Q()
  public readonly name: string;

  @JinFrame.Q({ encode: true })
  public readonly skill: string[];

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
  public readonly passing: string;

  @JinFrame.Q()
  public readonly name: string;

  @JinFrame.Q({ encode: true })
  public readonly skill: string[];

  constructor() {
    super({
      $$host: 'http://some.api.google.com',
      $$path: '/jinframe/:passing',
      $$method: 'get',
      $$retry: { max: 1 },
    });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];
  }
}

describe('TestGet9Frame', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  test('retry - getter', () => {
    const frame = new RetryTestGet01Frame();
    expect(frame.$$retry?.max).toEqual(3);
    expect(frame.$$retry?.interval).toEqual(20);
  });

  test('retry - setter', () => {
    const frame = new RetryTestGet01Frame();
    frame.$$retry = { max: 10, interval: 100 };
    expect(frame.$$retry?.max).toEqual(10);
    expect(frame.$$retry?.interval).toEqual(100);
  });

  test('nock-get09-retry-request', async () => {
    nock('http://some.api.google.com')
      .get('/jinframe/pass?name=ironman&skill=beam&skill=flying%21')
      .times(2)
      .reply(500, 'Internal Server Error')
      .get('/jinframe/pass?name=ironman&skill=beam&skill=flying%21')
      .reply(200, {
        message: 'hello',
      });

    const frame = new RetryTestGet01Frame();

    try {
      const resp = await frame.execute();
      expect(resp.status < 400).toEqual(true);
    } catch (err) {
      expect(err).toBeFalsy();
    }
  });

  test('nock-get09-retry-request over retry count', async () => {
    nock('http://some.api.google.com')
      .get('/jinframe/pass?name=ironman&skill=beam&skill=flying%21')
      .times(3)
      .reply(500, 'Internal Server Error')
      .get('/jinframe/pass?name=ironman&skill=beam&skill=flying%21')
      .reply(200, {
        message: 'hello',
      });

    await expect(async () => {
      const frame = new RetryTestGet01Frame();
      await frame.execute();
    }).rejects.toThrowError();
  });

  test('nock-get09-retry-request over retry count', async () => {
    nock('http://some.api.google.com')
      .get('/jinframe/pass?name=ironman&skill=beam&skill=flying%21')
      .times(3)
      .reply(500, 'Internal Server Error')
      .get('/jinframe/pass?name=ironman&skill=beam&skill=flying%21')
      .reply(200, {
        message: 'hello',
      });

    await expect(async () => {
      const frame = new RetryTestGet02Frame();
      await frame.execute();
    }).rejects.toThrowError();
  });
});
