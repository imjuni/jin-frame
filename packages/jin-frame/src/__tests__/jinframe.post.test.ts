import { JinEitherFrame } from '#frames/JinEitherFrame';
import { Post } from '#decorators/methods/Post';
import { isPass } from 'my-only-either';
import { http, HttpResponse, PathParams } from 'msw';
import { setupServer } from 'msw/node';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Param } from '#decorators/fields/Param';
import { Body } from '#decorators/fields/Body';
import { Header } from '#decorators/fields/Header';

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class TestPostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Body({ replaceAt: 'test.hello.marvel.name' })
  declare public readonly name: string;

  @Header({ replaceAt: 'test.hello.marvel.skill' })
  declare public readonly skill: string;

  @Body({ replaceAt: 'test.hello.marvel.gender' })
  declare public readonly gender: string;

  constructor() {
    super();

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = 'beam';
    this.gender = 'male';
  }
}

@Post({
  host: 'http://some.api.google.com/jinframe/:passing',
  contentType: 'application/x-www-form-urlencoded',
})
class TestUrlencodedPostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Body()
  declare public readonly username: string;

  @Body()
  declare public readonly password: string;

  constructor() {
    super();

    this.passing = 'pass';
    this.username = 'ironman';
    this.password = 'marvel';
  }
}

interface TestPostFrameBody {
  test: {
    hello: {
      marvel: { name: string; gender: string };
    };
  };
}

interface TestUrlencodedPostFrameBody {
  username: string;
  password: string;
}

describe('jinframe.test', () => {
  // MSW server configuration
  const server = setupServer();

  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    server.close();
  });

  it('msw-post-with-jinframe', async () => {
    server.use(
      http.post<PathParams<'passing'>, TestPostFrameBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          // JSON body validation
          const body = await request.json();
          if (body?.test?.hello?.marvel?.name === 'ironman' && body?.test?.hello?.marvel?.gender === 'male') {
            return HttpResponse.json({
              message: 'hello',
            });
          }

          return new HttpResponse('Invalid body', { status: 400 });
        },
      ),
    );

    const frame = new TestPostFrame();
    const resp = await frame.execute();

    expect(isPass(resp)).toEqual(true);
  });

  it('msw-post-without-eiter-jinframe', async () => {
    server.use(
      http.post<PathParams<'passing'>, TestPostFrameBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          // JSON body validation
          const body = await request.json();
          if (body?.test?.hello?.marvel?.name === 'ironman' && body?.test?.hello?.marvel?.gender === 'male') {
            return HttpResponse.json({
              message: 'hello',
            });
          }

          return new HttpResponse('Invalid body', { status: 400 });
        },
      ),
    );

    const frame = new TestPostFrame();
    const resp = await frame.execute();

    expect(isPass(resp)).toEqual(true);
  });

  it('msw-post-urlencoded', async () => {
    server.use(
      http.post<PathParams<'passing'>, TestUrlencodedPostFrameBody>(
        'http://some.api.google.com/jinframe/pass',
        async ({ request }) => {
          // URL-encoded body validation
          const formData = await request.formData();
          const username = formData.get('username');
          const password = formData.get('password');

          if (username === 'ironman' && password === 'marvel') {
            return HttpResponse.json({
              message: 'hello',
            });
          }

          return new HttpResponse('Invalid form data', { status: 400 });
        },
      ),
    );

    const frame = new TestUrlencodedPostFrame();
    const resp = await frame.execute();

    expect(isPass(resp)).toEqual(true);
  });
});
