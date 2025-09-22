import { JinEitherFrame } from '#frames/JinEitherFrame';
import { Post } from '#decorators/methods/Post';
import { http, HttpResponse, PathParams } from 'msw';
import { setupServer } from 'msw/node';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Param } from '#decorators/fields/Param';
import { Body } from '#decorators/fields/Body';
import { BaseValidator } from '#validators/BaseValidator';
import type { AxiosResponse } from 'axios';
import type { TValidationResult } from '#interfaces/TValidationResult';
import z from 'zod';

const messageSchema = z.object({
  message: z.string(),
});

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test001PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Body()
  declare public readonly username: string;

  @Body()
  declare public readonly password: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing/:raiseerr' })
class Test002PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Body()
  declare public readonly username: string;

  @Body()
  declare public readonly password: string;
}

class TestPostFrameValidator extends BaseValidator<
  AxiosResponse<{ message: string }>,
  { message: string },
  z.core.$ZodIssue
> {
  constructor() {
    super({ type: 'value' });
  }

  override getData(reply: AxiosResponse<{ message: string }>): { message: string } {
    return reply.data;
  }

  override validator(_data: { message: string }): TValidationResult<z.core.$ZodIssue> {
    const result = messageSchema.safeParse(_data);

    if (result.success) {
      return { valid: true };
    }

    return { valid: false, error: result.error.issues };
  }
}

@Post({
  host: 'http://some.api.google.com/jinframe/:passing',
  validator: new TestPostFrameValidator(),
})
class Test003PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Body()
  declare public readonly username: string;

  @Body()
  declare public readonly password: string;
}

interface JinEitherFrameTestResponse {
  message: string;
}

interface JinEitherFrameTestRequestBody {
  username: string;
  password: string;
}

describe('JinEitherFrame', () => {
  // MSW server configuration
  const server = setupServer();

  beforeEach(() => {
    server.listen({ onUnhandledRequest: 'bypass' });

    // 기본 핸들러: 모든 some.api.google.com 요청에 대해 404 반환
    // base handler: return 404 for all some.api.google.com requests
    server.use(http.post(/.*some\.api\.google\.com.*/, () => new HttpResponse('Not Found', { status: 404 })));
  });

  afterEach(() => {
    server.resetHandlers();
    server.close();
  });

  it('should return JinCreateError when request build fail', async () => {
    const frame = Test002PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'pass' });
    const requester = frame.create();
    const req = await requester();

    expect(req).toMatchObject({
      type: 'fail',
      fail: {
        $err: {
          __discriminator: 'JinCreateError',
        },
      },
    });
  });

  it('should return fail either when status is 400', async () => {
    server.use(
      http.post<PathParams<'passing'>, JinEitherFrameTestRequestBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.username === 'ironman' && body.password === 'marvel') {
            return HttpResponse.json<JinEitherFrameTestResponse>({ message: 'hello' }, { status: 400 });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

    const frame = Test001PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'pass' });
    const reply = await frame.execute({ validateStatus: (status) => status < 400 });

    if (reply.type === 'fail') {
      expect(reply.fail.status).toEqual(400);
    } else {
      throw new Error('Cannot reach this line');
    }
  });

  it('should return pass either when status is 200', async () => {
    server.use(
      http.post<PathParams<'passing'>, JinEitherFrameTestRequestBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.username === 'ironman' && body.password === 'marvel') {
            return HttpResponse.json<JinEitherFrameTestResponse>({ message: 'hello' });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

    const frame = Test001PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'pass' });
    const reply = await frame.execute({ validateStatus: (status) => status < 400 });

    if (reply.type === 'pass') {
      expect(reply.pass.status).toEqual(200);
    } else {
      throw new Error('Cannot reach this line');
    }
  });

  it('should return fail either when 404 not found', async () => {
    // 기본 핸들러가 모든 요청에 대해 404를 반환하므로 별도 설정 불필요
    // passing: 'fail'로 인해 /jinframe/fail을 호출하게 되어 404 발생

    const frame = Test001PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'fail' });
    const reply = await frame.execute();

    if (reply.type === 'fail') {
      expect(reply.fail.status).toEqual(404);
    } else {
      throw new Error('Cannot reach this line');
    }
  });

  it('should return fail either when validate stauts throw exception', async () => {
    server.use(
      http.post<PathParams<'passing'>, JinEitherFrameTestRequestBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.username === 'ironman' && body.password === 'marvel') {
            return HttpResponse.json<JinEitherFrameTestResponse>({ message: 'hello' });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

    const frame = Test001PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'pass' });
    const reply = await frame.execute({
      validateStatus: () => {
        throw new Error('error');
      },
    });

    if (reply.type === 'fail') {
      expect(reply.fail.status).toEqual(500);
    } else {
      throw new Error('Cannot reach this line');
    }
  });

  it('should execute async preHook when preHook is async function', async () => {
    let hookExecuted = false;

    @Post({ host: 'http://some.api.google.com/jinframe/:passing' })
    class AsyncPreHookFrame extends JinEitherFrame {
      @Param()
      declare public readonly passing: string;

      @Body()
      declare public readonly username: string;

      @Body()
      declare public readonly password: string;

      async $_preHook() {
        hookExecuted = true;
      }
    }

    server.use(
      http.post<PathParams<'passing'>, JinEitherFrameTestRequestBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.username === 'ironman' && body.password === 'marvel') {
            return HttpResponse.json<JinEitherFrameTestResponse>({ message: 'hello' });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

    const frame = AsyncPreHookFrame.of({ username: 'ironman', password: 'marvel', passing: 'pass' });
    const reply = await frame.execute({ validateStatus: (status) => status < 400 });

    expect(hookExecuted).toBeTruthy();
    if (reply.type === 'pass') {
      expect(reply.pass.status).toEqual(200);
    } else {
      throw new Error('Cannot reach this line');
    }
  });

  it('should execute async postHook when postHook is async function', async () => {
    let hookExecuted = false;

    @Post({ host: 'http://some.api.google.com/jinframe/:passing' })
    class AsyncPostHookFrame extends JinEitherFrame {
      @Param()
      declare public readonly passing: string;

      @Body()
      declare public readonly username: string;

      @Body()
      declare public readonly password: string;

      async $_postHook() {
        hookExecuted = true;
      }
    }

    server.use(
      http.post<PathParams<'passing'>, JinEitherFrameTestRequestBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.username === 'ironman' && body.password === 'marvel') {
            return HttpResponse.json<JinEitherFrameTestResponse>({ message: 'hello' });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

    const frame = AsyncPostHookFrame.of({ username: 'ironman', password: 'marvel', passing: 'pass' });
    const reply = await frame.execute({ validateStatus: (status) => status < 400 });

    expect(hookExecuted).toBeTruthy();
    if (reply.type === 'pass') {
      expect(reply.pass.status).toEqual(200);
    } else {
      throw new Error('Cannot reach this line');
    }
  });
});

describe('JinEitherFrame with validator', () => {
  // MSW server configuration
  const server = setupServer();

  beforeEach(() => {
    server.listen({ onUnhandledRequest: 'bypass' });

    // 기본 핸들러: 모든 some.api.google.com 요청에 대해 404 반환
    // base handler: return 404 for all some.api.google.com requests
    server.use(http.post(/.*some\.api\.google\.com.*/, () => new HttpResponse('Not Found', { status: 404 })));
  });

  afterEach(() => {
    server.resetHandlers();
    server.close();
  });

  it('should return JinCreateError when request build fail', async () => {
    server.use(
      http.post<PathParams<'passing'>, JinEitherFrameTestRequestBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          const body = await request.json();
          if (body.username === 'ironman' && body.password === 'marvel') {
            return HttpResponse.json<{ message: number }>({ message: 1234 });
          }
          return new HttpResponse('Bad Request', { status: 400 });
        },
      ),
    );

    const frame = Test003PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'pass' });
    const reply = await frame.execute();

    expect(reply).toMatchObject({
      type: 'fail',
      fail: {
        $validated: { valid: false },
      },
    });
  });
});
