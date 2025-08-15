import { JinEitherFrame } from '#frames/JinEitherFrame';
import { JinFrame } from '#frames/JinFrame';
import type { IFailReplyJinEitherFrame } from '#interfaces/IFailJinEitherFrame';
import type { TPassJinEitherFrame } from '#interfaces/TPassJinEitherFrame';
import { Get } from '#tools/decorators/MethodDecorators';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { isFail, isPass } from 'my-only-either';
import nock from 'nock';
import { afterEach, describe, expect, it } from 'vitest';

@Get({ host: 'http://some.api.google.com/jinframe/:passing' })
class TestGetFrame extends JinEitherFrame {
  @JinEitherFrame.P()
  declare public readonly passing: string;

  @JinEitherFrame.Q({ replaceAt: 'myname' })
  declare public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  declare public readonly skill: string[];

  constructor() {
    super({
      passing: 'pass',
      name: 'ironman',
      skill: ['beam', 'flying!'],
    });
  }

  override $_preHook(req: AxiosRequestConfig): void {
    console.log('pre hook trigger: ', req);
  }

  override $_postHook(req: AxiosRequestConfig, reply: IFailReplyJinEitherFrame | TPassJinEitherFrame<unknown>): void {
    console.log('post hook trigger: ', req);
    console.log(reply);
  }
}

@Get({ host: 'http://some.api.google.com/jinframe/:passing/test' })
class TestGet2Frame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.query()
  declare public readonly name: string;

  @JinEitherFrame.header()
  declare public readonly ttt: string;

  override async $_preHook(req: AxiosRequestConfig): Promise<void> {
    console.log(req);
  }

  override async $_postHook(
    _req: AxiosRequestConfig,
    reply: IFailReplyJinEitherFrame | TPassJinEitherFrame<unknown>,
  ): Promise<void> {
    console.log(reply);
  }

  constructor() {
    super({
      passing: 'hello',
      name: 'ironman',
      ttt: 'header value',
    });
  }
}

@Get({ host: 'http://some.api.google.com/jinframe/:passing' })
class TestGet3Frame extends JinFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.Q()
  declare public readonly name: string;

  @JinEitherFrame.Q({ encode: true })
  declare public readonly skill: string[];

  constructor() {
    super({
      passing: 'pass',
      name: 'ironman',
      skill: ['beam', 'flying!'],
    });
  }

  override $_preHook(req: AxiosRequestConfig): void {
    console.log('pre hook trigger: ', req);
  }

  override $_postHook(req: AxiosRequestConfig, reply: IFailReplyJinEitherFrame | TPassJinEitherFrame<unknown>): void {
    console.log('post hook trigger: ', req);
    console.log(reply);
  }
}

@Get({ host: 'http://some.api.google.com/jinframe/:passing' })
class TestGet4Frame extends JinFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.query()
  declare public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  declare public readonly skill: string[];

  constructor() {
    super({
      passing: 'pass',
      name: 'ironman',
      skill: ['beam', 'flying!'],
    });
  }

  override async $_preHook(req: AxiosRequestConfig): Promise<void> {
    console.log('pre hook trigger: ', req);
  }

  override async $_postHook(req: AxiosRequestConfig, reply: AxiosResponse): Promise<void> {
    console.log('post hook trigger: ', req);
    console.log(reply);
  }
}

@Get({ host: 'http://some.api.google.com/jinframe/:passing' })
class TestGet5Frame extends JinFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.query()
  declare public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  declare public readonly skill: string[];

  constructor() {
    super({
      passing: 'pass',
      name: 'ironman',
      skill: ['beam', 'flying!'],
    });
  }

  override $_preHook(req: AxiosRequestConfig): void {
    console.log('pre hook trigger: ', req);
  }
}

@Get({ host: 'http://some.api.google.com/jinframe/:passing' })
class TestGet6Frame extends JinFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.query()
  declare public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  declare public readonly skill: string[];

  constructor() {
    super({
      passing: 'pass',
      name: 'ironman',
      skill: ['beam', 'flying!'],
    });
  }

  override async $_preHook(req: AxiosRequestConfig): Promise<void> {
    console.log('pre hook trigger: ', req);
  }
}

@Get({ host: 'http://some.api.google.com/jinframe/:passing' })
class TestGet7Frame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.query()
  declare public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  declare public readonly skill: string[];

  constructor() {
    super({
      passing: 'pass',
      name: 'ironman',
      skill: ['beam', 'flying!'],
    });
  }

  override $_preHook(req: AxiosRequestConfig): void {
    console.log(req);
  }
}

@Get({ host: 'http://some.api.google.com/jinframe/:passing' })
class TestGet8Frame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.query()
  declare public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  declare public readonly skill: string[];

  constructor() {
    super({
      passing: 'pass',
      name: 'ironman',
      skill: ['beam', 'flying!'],
    });
  }

  override async $_preHook(req: AxiosRequestConfig): Promise<void> {
    console.log(req);
  }
}

describe('jinframe.test', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('nock-with-axios', async () => {
    nock('http://some.api.google.com').get('/test').reply(200, {
      message: 'hello',
    });

    await axios.get('http://some.api.google.com/test');
  });

  it('jin-either-frame', async () => {
    nock('http://some.api.google.com').get('/jinframe/pass?myname=ironman&skill=beam&skill=flying!').reply(200, {
      message: 'hello',
    });

    const frame = new TestGetFrame();
    const resp = await frame.execute();

    expect(isPass(resp)).toEqual(true);
  });

  it('jin-either-frame - pre hook no return', async () => {
    nock('http://some.api.google.com').get('/jinframe/pass?name=ironman&skill=beam&skill=flying!').reply(200, {
      message: 'hello',
    });

    const frame = new TestGet7Frame();
    const resp = await frame.execute();

    expect(isPass(resp)).toEqual(true);
  });

  it('jin-either-frame - async pre hook no return', async () => {
    nock('http://some.api.google.com').get('/jinframe/pass?name=ironman&skill=beam&skill=flying!').reply(200, {
      message: 'hello',
    });

    const frame = new TestGet8Frame();
    const resp = await frame.execute();

    expect(isPass(resp)).toEqual(true);
  });

  it('jin-either-frame post hook fail case', async () => {
    nock('http://some.api.google.com').get('/jinframe/pass?myname=ironman&skill=beam&skill=flying!').reply(400, {
      message: 'hello',
    });

    const frame = new TestGetFrame();
    const resp = await frame.execute();

    expect(isFail(resp)).toEqual(true);
  });

  it('jin-frame pre hook', async () => {
    nock('http://some.api.google.com').get('/jinframe/pass?name=ironman&skill=beam&skill=flying!').reply(200, {
      message: 'hello',
    });

    const frame = new TestGet3Frame();
    const resp = await frame.execute();

    expect(resp.status).toEqual(200);
  });

  it('jin-frame post hook fail case', async () => {
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

  it('jin-frame with async pre hook', async () => {
    nock('http://some.api.google.com').get('/jinframe/pass?name=ironman&skill=beam&skill=flying!').reply(200, {
      message: 'hello',
    });

    const frame = new TestGet4Frame();
    const resp = await frame.execute();

    expect(resp.status).toEqual(200);
  });

  it('jin-frame async post hook fail case', async () => {
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

  it('jin-frame with async pre hook - no return', async () => {
    nock('http://some.api.google.com').get('/jinframe/pass?name=ironman&skill=beam&skill=flying!').reply(200, {
      message: 'hello',
    });

    const frame = new TestGet5Frame();
    const resp = await frame.execute();

    expect(resp.status).toEqual(200);
  });

  it('jin-frame with async pre hook - no return', async () => {
    nock('http://some.api.google.com').get('/jinframe/pass?name=ironman&skill=beam&skill=flying!').reply(200, {
      message: 'hello',
    });

    const frame = new TestGet6Frame();
    const resp = await frame.execute();

    expect(resp.status).toEqual(200);
  });

  it('nock-get02-with-jinframe', async () => {
    nock('http://some2.api.google.com').get('/jinframe/hello/test?name=ironman').reply(200, {
      message: 'hello',
    });

    const frame = new TestGet2Frame();
    const resp = await frame.execute({ url: 'http://some2.api.google.com/jinframe/:passing/test' });

    expect(isPass(resp)).toEqual(true);
  });

  it('nock-get02-with-jinframe-fail', async () => {
    nock('http://some2.api.google.com').get('/jinframe/hello/test?name=ironman').reply(500, {
      message: 'hello',
    });

    const frame = new TestGet2Frame();
    const resp = await frame.execute({ url: 'http://some2.api.google.com' });

    expect(isFail(resp)).toEqual(true);
  });

  it('nock-get03-axios-request', async () => {
    nock('http://some.api.google.com').get('/jinframe/hello/test?name=ironman').reply(200, {
      message: 'hello',
    });

    const frame = new TestGet2Frame();
    const req = frame.request({ url: 'http://some.api.google.com/jinframe/:passing/test' });
    try {
      const resp = await axios.get(req.url ?? '', { ...req, validateStatus: () => true });

      expect(resp.status < 400).toEqual(true);
    } catch (err) {
      expect(err).toBeFalsy();
    }
  });
});
