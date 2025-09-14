import { JinFrame } from '#frames/JinFrame';
import type { TJinRequestConfig } from '#interfaces/TJinFrameResponse';
import { Get } from '#decorators/methods/Get';
import type { AxiosResponse } from 'axios';
import { http, HttpResponse, PathParams } from 'msw';
import { setupServer } from 'msw/node';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Param } from '#decorators/fields/Param';
import { Query } from '#decorators/fields/Query';

@Get({ host: 'http://some.api.google.com/jinframe/:passing', retry: { max: 3, interval: 20 } })
class RetryTestGet01Frame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @Query()
  declare public readonly name: string;

  @Query({ encode: true })
  declare public readonly skill: string[];

  constructor() {
    super();

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];
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
  @Param()
  declare public readonly passing: string;

  @Query()
  declare public readonly name: string;

  @Query({ encode: true })
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
    super();

    this.#retryFail = '';
    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];
  }
}

interface RetryTestSuccessResponse {
  message: string;
}

describe('TestGet9Frame', () => {
  // MSW server configuration
  const server = setupServer();

  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    server.close();
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
    let callCount = 0;

    server.use(
      http.get<PathParams<'passing'>>('http://some.api.google.com/jinframe/pass', ({ request }) => {
        const url = new URL(request.url);
        const name = url.searchParams.get('name');
        const skills = url.searchParams.getAll('skill');

        if (name === 'ironman' && skills.includes('beam') && skills.includes('flying!')) {
          callCount += 1;

          // First 2 calls return 500 error
          if (callCount <= 2) {
            return new HttpResponse('Internal Server Error', { status: 500 });
          }

          // 3rd call returns success
          return HttpResponse.json<RetryTestSuccessResponse>({
            message: 'hello',
          });
        }

        return new HttpResponse('Not Found', { status: 404 });
      }),
    );

    const frame = new RetryTestGet01Frame();

    const resp = await frame.execute();
    expect(resp.status < 400).toEqual(true);
    expect(frame.retryData?.try).toEqual(3);
  });

  it('over retry count', async () => {
    server.use(
      http.get<PathParams<'passing'>>('http://some.api.google.com/jinframe/pass', ({ request }) => {
        const url = new URL(request.url);
        const name = url.searchParams.get('name');
        const skills = url.searchParams.getAll('skill');

        if (name === 'ironman' && skills.includes('beam') && skills.includes('flying!')) {
          // Always return 500 error (will be called 4 times: initial + 3 retries)
          return new HttpResponse('Internal Server Error', { status: 500 });
        }

        return new HttpResponse('Not Found', { status: 404 });
      }),
    );

    const frame = new RetryTestGet01Frame();

    await expect(async () => {
      await frame.execute();
    }).rejects.toThrowError();

    console.log(frame.retryData);
  });

  it('retry with hook', async () => {
    const errorMessage = 'Internal Server Error';

    server.use(
      http.get<PathParams<'passing'>>('http://some.api.google.com/jinframe/pass', ({ request }) => {
        const url = new URL(request.url);
        const name = url.searchParams.get('name');
        const skills = url.searchParams.getAll('skill');

        if (name === 'ironman' && skills.includes('beam') && skills.includes('flying!')) {
          // Always return 500 error (will be called 3 times: initial + 2 retries)
          return new HttpResponse(errorMessage, { status: 500 });
        }

        return new HttpResponse('Not Found', { status: 404 });
      }),
    );

    const frame = new RetryTestGet02Frame();

    await expect(async () => {
      await frame.execute();
    }).rejects.toThrowError();

    console.log('A: ', frame.retryData, frame.retryFail);

    expect(frame.retryFail).toEqual(errorMessage);
  });
});
