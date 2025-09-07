import { JinCreateError } from '#frames/JinCreateError';
import { JinFrame } from '#frames/JinFrame';
import type { IDebugInfo } from '#interfaces/IDebugInfo';
import type { TJinFrameResponse, TJinRequestConfig } from '#interfaces/TJinFrameResponse';
import { Post } from '#decorators/methods/Post';
import { http, HttpResponse, PathParams } from 'msw';
import { setupServer } from 'msw/node';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
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

interface JinFrameTestResponse {
  message: string;
}

interface JinFrameTestRequestBody {
  username: string;
  password: string;
}

describe('JinFrame', () => {
  // MSW server configuration
  const server = setupServer();

  beforeEach(() => {
    server.listen({ onUnhandledRequest: 'bypass' });

    // 기본 핸들러: 모든 some.api.google.com 요청에 대해 404 반환
    server.use(http.post(/.*some\.api\.google\.com.*/, () => new HttpResponse('Not Found', { status: 404 })));
  });

  afterEach(() => {
    server.resetHandlers();
    server.close();
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
    server.use(
      http.post<PathParams<'passing'>, JinFrameTestRequestBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.username === 'ironman' && body.password === 'marvel') {
            return HttpResponse.json<JinFrameTestResponse>({ message: 'hello' }, { status: 400 });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

    await expect(async () => {
      const frame = Test001PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'pass' });
      await frame.execute({ validateStatus: (status) => status < 400 });
    }).rejects.toThrowError();
  });

  it('should return response object when response status code 200', async () => {
    server.use(
      http.post<PathParams<'passing'>, JinFrameTestRequestBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.username === 'ironman' && body.password === 'marvel') {
            return HttpResponse.json<JinFrameTestResponse>({ message: 'hello' });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

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

    server.use(
      http.post<PathParams<'passing'>, { name: string }>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.name === 'i-am-custom-body') {
            return HttpResponse.json<JinFrameTestResponse>({ message: 'hello' });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

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
    server.use(
      http.post<PathParams<'passing'>, JinFrameTestRequestBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.username === 'ironman' && body.password === 'marvel') {
            return new HttpResponse('not found', { status: 404 });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

    await expect(async () => {
      const frame = Test001PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'pass' });
      await frame.execute();
    }).rejects.toMatchObject({
      resp: { status: 404 },
    });
  });

  it('should throw exception from request builder when missing path parameter', async () => {
    server.use(
      http.post<PathParams<'passing'>, JinFrameTestRequestBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.username === 'ironman' && body.password === 'marvel') {
            return HttpResponse.json<JinFrameTestResponse>({ message: 'hello' });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

    const frame = Test002PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'fail' });

    try {
      await frame.execute();
    } catch (catched) {
      expect(catched as JinCreateError<any, any>).toBeDefined();
    }
  });

  it('should throw 404 not found exception when invalid url', async () => {
    // 기본 핸들러가 모든 요청에 대해 404를 반환하므로 별도 설정 불필요
    await expect(async () => {
      const frame = Test001PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'fail' });
      await frame.execute();
    }).rejects.toMatchObject({ resp: { status: 404 } });
  });

  it('exception - invalid exception', async () => {
    server.use(
      http.post<PathParams<'passing'>, JinFrameTestRequestBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.username === 'ironman' && body.password === 'marvel') {
            return HttpResponse.json<JinFrameTestResponse>({ message: 'hello' });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

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
    server.use(
      http.post<PathParams<'passing'>, JinFrameTestRequestBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.username === 'ironman' && body.password === 'marvel') {
            return new HttpResponse('not found', { status: 404 });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

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
    server.use(
      http.post<PathParams<'passing'>, JinFrameTestRequestBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.username === 'ironman' && body.password === 'marvel') {
            return HttpResponse.json<JinFrameTestResponse>({ message: 'hello' });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

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
    server.use(
      http.post<PathParams<'passing'>, JinFrameTestRequestBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.username === 'ironman' && body.password === 'marvel') {
            return HttpResponse.json<JinFrameTestResponse>({ message: 'hello' }, { status: 500 });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

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
    server.use(
      http.post<PathParams<'passing'>, JinFrameTestRequestBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.username === 'ironman' && body.password === 'marvel') {
            return HttpResponse.json<JinFrameTestResponse>({ message: 'hello' }, { status: 401 });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

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
  // MSW server configuration for this test suite
  const hookServer = setupServer();

  beforeEach(() => {
    hookServer.listen();
  });

  afterEach(() => {
    hookServer.resetHandlers();
    hookServer.close();
  });

  it('should throw error when override pre, post hook but dont configured retry configuration', async () => {
    hookServer.use(
      http.post<PathParams<'passing'>, JinFrameTestRequestBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.username === 'ironman' && body.password === 'marvel') {
            return HttpResponse.json<JinFrameTestResponse>({ message: 'error' }, { status: 400 });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

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
    hookServer.use(
      http.post<PathParams<'passing'>, JinFrameTestRequestBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.username === 'ironman' && body.password === 'marvel') {
            return HttpResponse.json<JinFrameTestResponse>({ message: 'hello' });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

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
  // MSW server configuration for this test suite
  const retryServer = setupServer();

  beforeEach(() => {
    retryServer.listen();
  });

  afterEach(() => {
    retryServer.resetHandlers();
    retryServer.close();
  });

  it('should every retry count but fail when server response 401 every request', async () => {
    retryServer.use(
      http.post<PathParams<'passing'>, JinFrameTestRequestBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.username === 'ironman' && body.password === 'marvel') {
            return HttpResponse.json<JinFrameTestResponse>({ message: 'error' }, { status: 401 });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

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
    let callCount = 0;

    retryServer.use(
      http.post<PathParams<'passing'>, JinFrameTestRequestBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.username === 'ironman' && body.password === 'marvel') {
            callCount += 1;

            if (callCount === 1) {
              return HttpResponse.json<JinFrameTestResponse>({ message: 'error' }, { status: 401 });
            }

            // 두 번째 이후 호출에는 404 반환 (URL not found 시뮬레이션)
            return new HttpResponse('Not Found', { status: 404 });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

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
      expect(frame.postHookCount).toEqual(1);
      expect(catched).toBeDefined();
    }
  });

  it('validateStatus true', async () => {
    retryServer.use(
      http.post<PathParams<'passing'>, JinFrameTestRequestBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.username === 'ironman' && body.password === 'marvel') {
            return HttpResponse.json<JinFrameTestResponse>({ message: 'success' });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

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
