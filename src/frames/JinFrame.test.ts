import { JinCreateError } from '#frames/JinCreateError';
import { JinEitherFrame } from '#frames/JinEitherFrame';
import { JinFrame } from '#frames/JinFrame';
import type { JinRequestError } from '#frames/JinRequestError';
import type { IDebugInfo } from '#interfaces/IDebugInfo';
import type { IFailReplyJinEitherFrame } from '#interfaces/IFailJinEitherFrame';
import type { TJinFrameResponse, TJinRequestConfig } from '#interfaces/TJinFrameResponse';
import type { TPassJinEitherFrame } from '#interfaces/TPassJinEitherFrame';
import { Post } from '#tools/decorators/methods/Post';
import nock from 'nock';
import { afterEach, describe, expect, it } from 'vitest';

class CustomError extends Error {
  readonly discriminator = '__CustomError__';

  readonly log: Record<string, string>;

  constructor(message: string, log: Record<string, string>) {
    super(message);

    this.log = log;
  }
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test001PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.param()
  declare public readonly passing: string;

  @JinFrame.body()
  declare public readonly username: string;

  @JinFrame.body()
  declare public readonly password: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing/:raiseerr' })
class Test002PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.param()
  declare public readonly passing: string;

  @JinFrame.body()
  declare public readonly username: string;

  @JinFrame.body()
  declare public readonly password: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test003PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.param()
  declare public readonly passing: string;

  @JinFrame.body()
  declare public readonly username: string;

  @JinFrame.body()
  declare public readonly password: string;

  accessor postHookCount = 0;

  accessor preHookCount = 0;

  async $_postHook(
    _req: TJinRequestConfig,
    _result: TJinFrameResponse<{ message: string }, { message: string }>,
    _debugInfo: IDebugInfo,
  ): Promise<void> {
    this.postHookCount += 1;
    console.log('post hook executed: ', this.postHookCount);
  }

  async $_preHook(_req: TJinRequestConfig): Promise<void> {
    this.preHookCount += 1;
    console.log('pre hook executed: ', this.preHookCount);
  }
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test004PostEitherFrame extends JinEitherFrame<{ message: string }> {
  @JinFrame.param()
  declare public readonly passing: string;

  @JinFrame.body()
  declare public readonly username: string;

  @JinFrame.body()
  declare public readonly password: string;

  accessor postHookCount = 0;

  accessor preHookCount = 0;

  async $_postHook(
    _req: TJinRequestConfig,
    _reply: IFailReplyJinEitherFrame<{ message: string }> | TPassJinEitherFrame<{ message: string }>,
  ): Promise<void> {
    this.postHookCount += 1;
    console.log('post hook executed: ', this.postHookCount);
  }

  async $_preHook(_req: TJinRequestConfig): Promise<void> {
    this.preHookCount += 1;
    console.log('pre hook executed: ', this.preHookCount);
  }
}

describe('JinFrame', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('validateStatus false', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(400, {
      message: 'hello',
    });

    const frame = new Test001PostFrame({ username: 'ironman', password: 'marvel', passing: 'pass' });
    try {
      await frame.execute({ validateStatus: (status) => status < 400 });
    } catch (catched) {
      expect(catched).toBeDefined();
    }
  });

  it('validateStatus true', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(200, {
      message: 'hello',
    });

    const frame = new Test001PostFrame({
      username: 'ironman',
      password: 'marvel',
      passing: 'pass',
    });
    const reply = await frame.execute({ validateStatus: (status) => status < 400 });
    expect(reply.status).toEqual(200);
  });

  it('exception - type01 404', async () => {
    nock('http://some.api.google.com')
      .post('/jinframe/pass', { username: 'ironman', password: 'marvel' })
      .reply(404, 'not found');

    const frame = new Test001PostFrame({ username: 'ironman', password: 'marvel', passing: 'pass' });

    try {
      await frame.execute();
    } catch (catched) {
      expect((catched as JinRequestError<any, any>).resp?.status).toEqual(404);
    }
  });

  it('exception - type02 404', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(200, {
      message: 'hello',
    });

    const frame = new Test002PostFrame({ username: 'ironman', password: 'marvel', passing: 'fail' });

    try {
      await frame.execute();
    } catch (catched) {
      expect(catched as JinCreateError<any, any>).toBeDefined();
    }
  });

  it('exception - type03 404', async () => {
    nock('http://some.api.google.com')
      .post('/jinframe/pass', { username: 'ironman', password: 'marvel' })
      .reply(200, { message: 'hello' });

    const frame = new Test001PostFrame({ username: 'ironman', password: 'marvel', passing: 'fail' });

    try {
      await frame.execute();
    } catch (catched) {
      expect((catched as JinRequestError<any, any>).resp?.status).toEqual(500);
    }
  });

  it('exception - invalid exception', async () => {
    nock('http://some.api.google.com')
      .post('/jinframe/pass', { username: 'ironman', password: 'marvel' })
      .reply(200, { message: 'hello' });

    const frame = new Test001PostFrame({ username: 'ironman', password: 'marvel', passing: 'pass' });

    try {
      await frame.execute({
        validateStatus: () => {
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw 'invalid exception';
        },
      });
    } catch (catched) {
      expect((catched as JinRequestError<any, any>).resp?.status).toEqual(500);
    }
  });

  it('exception - type01 404 - getError', async () => {
    nock('http://some.api.google.com')
      .post('/jinframe/pass', { username: 'ironman', password: 'marvel' })
      .reply(404, 'not found');

    const frame = new Test001PostFrame({ username: 'ironman', password: 'marvel', passing: 'pass' });

    try {
      await frame.execute({
        getError: (err) => {
          if (err instanceof JinCreateError) {
            return new CustomError(err.message, { status: `${err.status ?? 500}` });
          }

          return new CustomError(err.message, { status: `${err.status ?? 500}` });
        },
      });
    } catch (catched) {
      expect((catched as CustomError).log).toMatchObject({ status: '404' });
    }
  });

  it('exception - type03 404 - getError', async () => {
    nock('http://some.api.google.com')
      .post('/jinframe/pass', { username: 'ironman', password: 'marvel' })
      .reply(200, { message: 'hello' });

    const frame = new Test001PostFrame({ username: 'ironman', password: 'marvel', passing: 'fail' });

    try {
      await frame.execute({
        getError: (err) => {
          if (err instanceof JinCreateError) {
            return new CustomError(err.message, { status: `${err.status ?? 500}` });
          }

          return new CustomError(err.message, { status: `${err.status ?? 500}` });
        },
      });
    } catch (catched) {
      expect((catched as CustomError).log).toMatchObject({ status: '500' });
    }
  });

  it('exception - invalid exception - getError', async () => {
    nock('http://some.api.google.com')
      .post('/jinframe/pass', { username: 'ironman', password: 'marvel' })
      .reply(200, { message: 'hello' });

    const frame = new Test001PostFrame({ username: 'ironman', password: 'marvel', passing: 'pass' });

    try {
      await frame.execute({
        validateStatus: () => {
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw 'invalid exception';
        },
        getError: (err) => {
          if (err instanceof JinCreateError) {
            return new CustomError(err.message, { status: `${err.status ?? 500}` });
          }

          return new CustomError(err.message, { status: `${err.status ?? 500}` });
        },
      });
    } catch (catched) {
      expect((catched as CustomError).log).toMatchObject({ status: '500' });
    }
  });
});

describe('hook count frame test', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('validateStatus false', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(400, {
      message: 'error',
    });

    const frame = new Test003PostFrame({ username: 'ironman', password: 'marvel', passing: 'pass' });
    try {
      await frame.execute({ validateStatus: (status) => status < 400 });
    } catch (catched) {
      expect(frame.preHookCount).toEqual(1);
      expect(frame.postHookCount).toEqual(1);
      expect(catched).toBeDefined();
    }
  });

  it('validateStatus true', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(200, {
      message: 'hello',
    });

    const frame = new Test003PostFrame({
      username: 'ironman',
      password: 'marvel',
      passing: 'pass',
    });

    const reply = await frame.execute({ validateStatus: (status) => status < 400 });
    expect(frame.preHookCount).toEqual(1);
    expect(frame.postHookCount).toEqual(1);
    expect(reply.status).toEqual(200);
  });
});

describe('hook count either frame test', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('validateStatus false', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(400, {
      message: 'error',
    });

    const frame = new Test004PostEitherFrame({ username: 'ironman', password: 'marvel', passing: 'pass' });
    try {
      await frame.execute({ validateStatus: (status) => status < 400 });
    } catch (catched) {
      expect(frame.preHookCount).toEqual(1);
      expect(frame.postHookCount).toEqual(1);
      expect(catched).toBeDefined();
    }
  });

  it('validateStatus true', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(200, {
      message: 'error',
    });

    const frame = new Test004PostEitherFrame({
      username: 'ironman',
      password: 'marvel',
      passing: 'pass',
    });

    const reply = await frame.execute({ validateStatus: (status) => status < 400 });
    expect(frame.preHookCount).toEqual(1);
    expect(frame.postHookCount).toEqual(1);
    expect(reply.type).toEqual('pass');
  });
});
