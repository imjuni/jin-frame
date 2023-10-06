/* eslint-disable class-methods-use-this, no-console, max-classes-per-file */

import { JinEitherFrame } from '#frames/JinEitherFrame';
import { JinFrame } from '#frames/JinFrame';
import type { IFailReplyJinEitherFrame } from '#interfaces/IFailJinEitherFrame';
import type { TPassJinEitherFrame } from '#interfaces/TPassJinEitherFrame';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { isFail, isPass } from 'my-only-either';
import nock from 'nock';

class TestGetFrame extends JinEitherFrame {
  @JinEitherFrame.P()
  public readonly passing: string;

  @JinEitherFrame.Q({ replaceAt: 'myname' })
  public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  public readonly skill: string[];

  constructor() {
    super({ $$host: 'http://some.api.google.com', $$path: '/jinframe/:passing', $$method: 'get' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];
  }

  $$preHook(req: AxiosRequestConfig): void {
    console.log('pre hook trigger: ', req);
  }

  $$postHook(req: AxiosRequestConfig, reply: IFailReplyJinEitherFrame<unknown> | TPassJinEitherFrame<unknown>): void {
    console.log('post hook trigger: ', req);
    console.log(reply);
  }
}

class TestGet2Frame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.query()
  public readonly name: string;

  @JinEitherFrame.header()
  public readonly ttt: string;

  override async $$preHook(req: AxiosRequestConfig): Promise<void> {
    console.log(req);
  }

  override async $$postHook(
    _req: AxiosRequestConfig,
    reply: IFailReplyJinEitherFrame<unknown> | TPassJinEitherFrame<unknown>,
  ): Promise<void> {
    console.log(reply);
  }

  constructor(host: string) {
    super({ $$host: host, $$path: '/jinframe/:passing/test', $$method: 'get' });

    this.passing = 'hello';
    this.name = 'ironman';
    this.ttt = 'header value';
  }
}

class TestGet3Frame extends JinFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.Q()
  public readonly name: string;

  @JinEitherFrame.Q({ encode: true })
  public readonly skill: string[];

  constructor() {
    super({ $$host: 'http://some.api.google.com', $$path: '/jinframe/:passing', $$method: 'get' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];
  }

  override $$preHook(req: AxiosRequestConfig): void {
    console.log('pre hook trigger: ', req);
  }

  override $$postHook(
    req: AxiosRequestConfig,
    reply: IFailReplyJinEitherFrame<unknown> | TPassJinEitherFrame<unknown>,
  ): void {
    console.log('post hook trigger: ', req);
    console.log(reply);
  }
}

class TestGet4Frame extends JinFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.query()
  public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  public readonly skill: string[];

  constructor() {
    super({ $$host: 'http://some.api.google.com', $$path: '/jinframe/:passing', $$method: 'get' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];
  }

  override async $$preHook(req: AxiosRequestConfig): Promise<void> {
    console.log('pre hook trigger: ', req);
  }

  override async $$postHook(req: AxiosRequestConfig, reply: AxiosResponse): Promise<void> {
    console.log('post hook trigger: ', req);
    console.log(reply);
  }
}

class TestGet5Frame extends JinFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.query()
  public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  public readonly skill: string[];

  constructor() {
    super({ $$host: 'http://some.api.google.com', $$path: '/jinframe/:passing', $$method: 'get' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];
  }

  override $$preHook(req: AxiosRequestConfig): void {
    console.log('pre hook trigger: ', req);
  }
}

class TestGet6Frame extends JinFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.query()
  public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  public readonly skill: string[];

  constructor() {
    super({ $$host: 'http://some.api.google.com', $$path: '/jinframe/:passing', $$method: 'get' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];
  }

  override async $$preHook(req: AxiosRequestConfig): Promise<void> {
    console.log('pre hook trigger: ', req);
  }
}

class TestGet7Frame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.query()
  public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  public readonly skill: string[];

  constructor() {
    super({ $$host: 'http://some.api.google.com', $$path: '/jinframe/:passing', $$method: 'get' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];
  }

  override $$preHook(req: AxiosRequestConfig): void {
    console.log(req);
  }
}

class TestGet8Frame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.query()
  public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  public readonly skill: string[];

  constructor() {
    super({ $$host: 'http://some.api.google.com', $$path: '/jinframe/:passing', $$method: 'get' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];
  }

  override async $$preHook(req: AxiosRequestConfig): Promise<void> {
    console.log(req);
  }
}

describe('jinframe.test', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  test('nock-with-axios', async () => {
    nock('http://some.api.google.com').get('/test').reply(200, {
      message: 'hello',
    });

    await axios.get('http://some.api.google.com/test');
  });

  test('jin-either-frame', async () => {
    nock('http://some.api.google.com').get('/jinframe/pass?myname=ironman&skill=beam&skill=flying!').reply(200, {
      message: 'hello',
    });

    const frame = new TestGetFrame();
    const resp = await frame.execute();

    expect(isPass(resp)).toEqual(true);
  });

  test('jin-either-frame - pre hook no return', async () => {
    nock('http://some.api.google.com').get('/jinframe/pass?name=ironman&skill=beam&skill=flying!').reply(200, {
      message: 'hello',
    });

    const frame = new TestGet7Frame();
    const resp = await frame.execute();

    expect(isPass(resp)).toEqual(true);
  });

  test('jin-either-frame - async pre hook no return', async () => {
    nock('http://some.api.google.com').get('/jinframe/pass?name=ironman&skill=beam&skill=flying!').reply(200, {
      message: 'hello',
    });

    const frame = new TestGet8Frame();
    const resp = await frame.execute();

    expect(isPass(resp)).toEqual(true);
  });

  test('jin-either-frame post hook fail case', async () => {
    nock('http://some.api.google.com').get('/jinframe/pass?myname=ironman&skill=beam&skill=flying!').reply(400, {
      message: 'hello',
    });

    const frame = new TestGetFrame();
    const resp = await frame.execute();

    expect(isFail(resp)).toEqual(true);
  });

  test('jin-frame pre hook', async () => {
    nock('http://some.api.google.com').get('/jinframe/pass?name=ironman&skill=beam&skill=flying!').reply(200, {
      message: 'hello',
    });

    const frame = new TestGet3Frame();
    const resp = await frame.execute();

    expect(resp.status).toEqual(200);
  });

  test('jin-frame post hook fail case', async () => {
    nock('http://some.api.google.com').get('/jinframe/pass?name=ironman&skill=beam&skill=flying!').reply(400, {
      message: 'hello',
    });

    try {
      const frame = new TestGet3Frame();
      await frame.execute();
    } catch (caught) {
      expect(caught).toBeTruthy();
    }
  });

  test('jin-frame with async pre hook', async () => {
    nock('http://some.api.google.com').get('/jinframe/pass?name=ironman&skill=beam&skill=flying!').reply(200, {
      message: 'hello',
    });

    const frame = new TestGet4Frame();
    const resp = await frame.execute();

    expect(resp.status).toEqual(200);
  });

  test('jin-frame async post hook fail case', async () => {
    nock('http://some.api.google.com').get('/jinframe/pass?name=ironman&skill=beam&skill=flying!').reply(400, {
      message: 'hello',
    });

    try {
      const frame = new TestGet4Frame();
      await frame.execute();
    } catch (caught) {
      expect(caught).toBeTruthy();
    }
  });

  test('jin-frame with async pre hook - no return', async () => {
    nock('http://some.api.google.com').get('/jinframe/pass?name=ironman&skill=beam&skill=flying!').reply(200, {
      message: 'hello',
    });

    const frame = new TestGet5Frame();
    const resp = await frame.execute();

    expect(resp.status).toEqual(200);
  });

  test('jin-frame with async pre hook - no return', async () => {
    nock('http://some.api.google.com').get('/jinframe/pass?name=ironman&skill=beam&skill=flying!').reply(200, {
      message: 'hello',
    });

    const frame = new TestGet6Frame();
    const resp = await frame.execute();

    expect(resp.status).toEqual(200);
  });

  test('nock-get02-with-jinframe', async () => {
    nock('http://some.api.google.com').get('/jinframe/hello/test?name=ironman').reply(200, {
      message: 'hello',
    });

    const frame = new TestGet2Frame('http://some.api.google.com');
    const resp = await frame.execute();

    expect(isPass(resp)).toEqual(true);
  });

  test('nock-get02-with-jinframe-fail', async () => {
    nock('http://some.api.google.com').get('/jinframe/hello/test?name=ironman').reply(500, {
      message: 'hello',
    });

    const frame = new TestGet2Frame('http://some.api.google.com');
    const resp = await frame.execute();

    expect(isFail(resp)).toEqual(true);
  });

  test('nock-get03-axios-request', async () => {
    nock('http://some.api.google.com').get('/jinframe/hello/test?name=ironman').reply(200, {
      message: 'hello',
    });

    const frame = new TestGet2Frame('http://some.api.google.com');
    const req = frame.request();
    try {
      const resp = await axios.get(req.url ?? '', { ...req, validateStatus: () => true });

      expect(resp.status < 400).toEqual(true);
    } catch (err) {
      expect(err).toBeFalsy();
    }
  });
});
