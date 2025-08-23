import { JinCreateError } from '#frames/JinCreateError';
import { JinFrame } from '#frames/JinFrame';
import type { IDebugInfo } from '#interfaces/IDebugInfo';
import type { TJinFrameResponse, TJinRequestConfig } from '#interfaces/TJinFrameResponse';
import { Post } from '#decorators/methods/Post';
import nock from 'nock';
import { afterEach, describe, expect, it } from 'vitest';
import { Param } from '#decorators/fields/Param';
import { Body } from '#decorators/fields/Body';
import { AxiosResponse } from 'axios';

class CustomError extends Error {
  readonly discriminator = '__CustomError__';

  readonly log: Record<string, string>;

  constructor(message: string, log: Record<string, string>) {
    super(message);

    this.log = log;
  }
}

@Post({
  host: 'http://some.api.google.com/jinframe/:passing',
  authoriztion: 'Bearer i-am-bearer-authorization-key',
})
class Test001PostFrame extends JinFrame<{ message: string }> {
  @Param()
  declare public readonly passing: string;

  @Body()
  declare public readonly username: string;

  @Body()
  declare public readonly password: string;
}

@Post({
  host: 'http://some.api.google.com/jinframe/:passing/:raiseerr',
})
class Test002PostFrame extends JinFrame<{ message: string }> {
  @Param()
  declare public readonly passing: string;

  @Body()
  declare public readonly username: string;

  @Body()
  declare public readonly password: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test003PostFrame extends JinFrame<{ message: string }> {
  @Param()
  declare public readonly passing: string;

  @Body()
  declare public readonly username: string;

  @Body()
  declare public readonly password: string;

  accessor postHookCount = 0;

  accessor preHookCount = 0;

  override async $_postHook(
    _req: TJinRequestConfig,
    _result: TJinFrameResponse<{ message: string }, { message: string }>,
    _debugInfo: IDebugInfo,
  ): Promise<void> {
    this.postHookCount += 1;
    // console.log('post hook executed: ', this.postHookCount);
  }

  override async $_preHook(_req: TJinRequestConfig): Promise<void> {
    this.preHookCount += 1;
    // console.log('pre hook executed: ', this.preHookCount);
  }
}

@Post({
  host: 'http://some.api.google.com/jinframe/:passing',
  retry: { max: 3, interval: 100 },
})
class Test004PostFrame extends JinFrame<{ message: string }> {
  @Param()
  declare public readonly passing: string;

  @Body()
  declare public readonly username: string;

  @Body()
  declare public readonly password: string;

  accessor postHookCount = 0;

  accessor preHookCount = 0;

  override async $_postHook(
    _req: TJinRequestConfig,
    _reply: AxiosResponse<{ message: string }>,
    _debugInfo: IDebugInfo,
  ): Promise<void> {
    this.postHookCount += 1;
    console.log('post hook executed: ', this.postHookCount);
  }

  override async $_preHook(_req: TJinRequestConfig): Promise<void> {
    this.preHookCount += 1;
    console.log('pre hook executed: ', this.preHookCount);
  }
}

describe('JinFrame', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should return frame URL when using signature', () => {
    const url = new URL('http://some.api.google.com/jinframe/:passing');
    expect(Test001PostFrame.getEndpoint()).toEqual(url);
  });

  it('should return instance when using builder from function', () => {
    const frame = Test001PostFrame.of((b) => b.from({ username: 'ironman', password: 'marvel', passing: 'pass' }));

    expect(frame.passing).toEqual('pass');
    expect(frame.password).toEqual('marvel');
    expect(frame.username).toEqual('ironman');
  });

  it('should return instance when using builder from function', () => {
    const frame = Test001PostFrame.of((b) =>
      b.set('username', 'ironman').set('passing', 'pass').set('password', 'marvel').auto(),
    );

    expect(frame.passing).toEqual('pass');
    expect(frame.password).toEqual('marvel');
    expect(frame.username).toEqual('ironman');
  });

  it('should return instance when using builder from function', () => {
    const frame = Test001PostFrame.of((b) =>
      b.set('username', 'ironman').auto().set('passing', 'pass').set('password', 'marvel'),
    );
    expect(frame.passing).toEqual('pass');
    expect(frame.password).toEqual('marvel');
    expect(frame.username).toEqual('ironman');
  });

  it('should throw exception when response status code 400', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(400, {
      message: 'hello',
    });

    await expect(async () => {
      const frame = Test001PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'pass' });
      await frame.execute({ validateStatus: (status) => status < 400 });
    }).rejects.toThrowError();
  });

  it('should return response object when response status code 200', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(200, {
      message: 'hello',
    });

    const frame = Test001PostFrame.of({
      username: 'ironman',
      password: 'marvel',
      passing: 'pass',
    });

    const reply = await frame.execute({ validateStatus: (status) => status < 400 });
    expect(reply.status).toEqual(200);
  });

  it('shoud return response object when using custom body', async () => {
    const customBody = { name: 'i-am-custom-body' };

    nock('http://some.api.google.com').post('/jinframe/pass', customBody).reply(200, {
      message: 'hello',
    });

    const frame = Test001PostFrame.of({
      username: 'ironman',
      password: 'marvel',
      passing: 'pass',
    });

    const reply = await frame.execute({
      validateStatus: (status) => status < 400,
      customBody,
    });

    expect(reply.data).toEqual({ message: 'hello' });
  });

  it('should throw exception when status 404 response', async () => {
    nock('http://some.api.google.com')
      .post('/jinframe/pass', { username: 'ironman', password: 'marvel' })
      .reply(404, 'not found');

    await expect(async () => {
      const frame = Test001PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'pass' });
      await frame.execute();
    }).rejects.toMatchObject({
      resp: { status: 404 },
    });
  });

  it('should throw exception from request builder when missing path parameter', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(200, {
      message: 'hello',
    });

    const frame = Test002PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'fail' });

    try {
      await frame.execute();
    } catch (catched) {
      expect(catched as JinCreateError<any, any>).toBeDefined();
    }
  });

  it('should throw 404 not found exception when invalid url', async () => {
    nock('http://some.api.google.com')
      .post('/jinframe/pass', { username: 'ironman', password: 'marvel' })
      .reply(200, { message: 'hello' });

    await expect(async () => {
      const frame = Test001PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'fail' });
      await frame.execute();
    }).rejects.toMatchObject({ resp: { status: 404 } });
  });

  it('exception - invalid exception', async () => {
    nock('http://some.api.google.com')
      .post('/jinframe/pass', { username: 'ironman', password: 'marvel' })
      .reply(200, { message: 'hello' });

    await expect(async () => {
      const frame = Test001PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'pass' });
      await frame.execute({
        validateStatus: () => {
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw 'invalid exception';
        },
      });
    }).rejects.toMatchObject({ resp: { status: 500 } });
  });

  it('should raise error wrap custom error using getError when server response 404', async () => {
    nock('http://some.api.google.com')
      .post('/jinframe/pass', { username: 'ironman', password: 'marvel' })
      .reply(404, 'not found');

    await expect(async () => {
      const frame = Test001PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'pass' });
      await frame.execute({
        getError: (err) => {
          if (err instanceof JinCreateError) {
            return new CustomError(err.message, { status: `${err.status ?? 500}` });
          }

          return new CustomError(err.message, { status: `${err.status ?? 500}` });
        },
      });
    }).rejects.toMatchObject({ log: { status: '404' } });
  });

  it('should raise error wrap custom error using getError when request building', async () => {
    nock('http://some.api.google.com')
      .post('/jinframe/pass', { username: 'ironman', password: 'marvel' })
      .reply(200, { message: 'hello' });

    await expect(async () => {
      const frame = Test001PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'fail' });
      await frame.execute({
        getError: (err) => {
          if (err instanceof JinCreateError) {
            return new CustomError(err.message, { status: `${err.status ?? 500}` });
          }

          return new CustomError(err.message, { status: `${err.status ?? 500}` });
        },
      });
    }).rejects.toMatchObject({ log: { status: '404' } });
  });

  it('should custom wrap using getError when unknown error raise on request api', async () => {
    nock('http://some.api.google.com')
      .post('/jinframe/pass', { username: 'ironman', password: 'marvel' })
      .reply(500, { message: 'hello' });

    await expect(async () => {
      const frame = Test001PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'pass' });
      await frame.execute({
        getError: (err) => {
          if (err instanceof JinCreateError) {
            return new CustomError(err.message, { status: `${err.status ?? 500}` });
          }

          return new CustomError(err.message, { status: `${err.status ?? 500}` });
        },
      });
    }).rejects.toMatchObject({
      log: { status: '500' },
    });
  });

  it('should custom wrap using getError when unknown error raise on hook', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(401, {
      message: 'hello',
    });

    await expect(async () => {
      const frame = Test003PostFrame.of({
        username: 'ironman',
        password: 'marvel',
        passing: 'pass',
        postHookCount: 0,
        preHookCount: 0,
      });
      frame.$_postHook = () => {
        throw new Error('unknown error raised');
      };

      await frame.execute({
        getError: (err) => {
          if (err instanceof JinCreateError) {
            return new CustomError(err.message, { status: `${err.status ?? 500}` });
          }

          return new CustomError(err.message, { status: `${err.status ?? 500}` });
        },
      });
    }).rejects.toMatchObject({
      log: { status: '500' },
    });
  });
});

describe('JinFrame pre, post Hook execution', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should throw error when override pre, post hook but dont configured retry configuration', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(400, {
      message: 'error',
    });

    await expect(async () => {
      const frame = Test003PostFrame.of({
        username: 'ironman',
        password: 'marvel',
        passing: 'pass',
        postHookCount: 0,
        preHookCount: 0,
      });
      await frame.execute({ validateStatus: (status) => status < 400 });
    }).rejects.toThrowError();
  });

  it('should response reply data when override pre, post hook but dont configured retry configuration', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(200, {
      message: 'hello',
    });

    const frame = Test003PostFrame.of({
      username: 'ironman',
      password: 'marvel',
      passing: 'pass',
      postHookCount: 0,
      preHookCount: 0,
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

  it('should every retry count but fail when server response 401 every request', async () => {
    nock('http://some.api.google.com')
      .post('/jinframe/pass', { username: 'ironman', password: 'marvel' })
      .times(5)
      .reply(401, {
        message: 'error',
      });

    const frame = Test004PostFrame.of({
      username: 'ironman',
      password: 'marvel',
      passing: 'pass',
      postHookCount: 0,
      preHookCount: 0,
    });

    try {
      await frame.execute();
    } catch (catched) {
      expect(frame.getData('retry')?.try).toEqual(3);
      expect(frame.preHookCount).toEqual(1);
      expect(frame.postHookCount).toEqual(1);
      expect(catched).toBeDefined();
    }
  });

  it('should every retry count but fail when server response one time after not found url', async () => {
    nock('http://some.api.google.com')
      .post('/jinframe/pass', { username: 'ironman', password: 'marvel' })
      .times(1)
      .reply(401, {
        message: 'error',
      });

    const frame = Test004PostFrame.of({
      username: 'ironman',
      password: 'marvel',
      passing: 'pass',
      postHookCount: 0,
      preHookCount: 0,
    });

    try {
      await frame.execute({ validateStatus: (status) => status < 400 });
    } catch (catched) {
      expect(frame.getData('retry')?.try).toEqual(3);
      expect(frame.preHookCount).toEqual(1);
      expect(frame.postHookCount).toEqual(0);
      expect(catched).toBeDefined();
    }
  });

  it('validateStatus true', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(200, {
      message: 'success',
    });

    const frame = Test004PostFrame.of({
      username: 'ironman',
      password: 'marvel',
      passing: 'pass',
      postHookCount: 0,
      preHookCount: 0,
    });

    const reply = await frame.execute();

    expect(frame.getData('retry')?.try).toEqual(1);
    expect(frame.preHookCount).toEqual(1);
    expect(frame.postHookCount).toEqual(1);
    expect(reply.status).toEqual(200);
  });
});
