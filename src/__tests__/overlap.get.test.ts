import { JinEitherFrame } from '#frames/JinEitherFrame';
import { Post } from '#decorators/methods/Post';
import { http, HttpResponse, PathParams } from 'msw';
import { setupServer } from 'msw/node';
import { afterEach, beforeEach, it } from 'vitest';
import { Param } from '#decorators/fields/Param';
import { Query } from '#decorators/fields/Query';
import { Body } from '#decorators/fields/Body';
import { Header } from '#decorators/fields/Header';

@Post({
  host: 'http://some.api.google.com',
  path: '/jinframe/:passing/:id',
})
class TestGetFrame extends JinEitherFrame {
  @Param()
  @Query()
  @Body()
  @Header()
  declare public readonly id: string;

  @Param()
  declare public readonly passing: string;

  @Query()
  declare public readonly name: string;

  @Query({ encode: false, comma: true })
  declare public readonly skills: string[];
}

interface TestOverlapResponse {
  message: string;
}

interface TestOverlapRequestBody {
  id: string;
}

// MSW server configuration
const server = setupServer();

beforeEach(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  server.close();
});

it('overlap-param-query', async () => {
  server.use(
    http.post<PathParams<'passing'>, TestOverlapRequestBody>(
      'http://some.api.google.com/jinframe/pass/3132',
      async ({ request }) => {
        const url = new URL(request.url);
        const body = await request.json();

        // Check query parameters
        const passing = url.searchParams.get('passing');
        const name = url.searchParams.get('name');
        const skills = url.searchParams.get('skills');

        // Check body
        const bodyId = body.id;

        // Check headers
        const headerId = request.headers.get('id');

        if (
          passing === 'pass' &&
          name === 'ironman' &&
          skills === 'beam,flying!' &&
          bodyId === 'pass' &&
          headerId === 'pass'
        ) {
          return HttpResponse.json<TestOverlapResponse>({
            message: 'hello',
          });
        }

        return new HttpResponse('Invalid request', { status: 400 });
      },
    ),
  );

  const frame = TestGetFrame.of({ id: '3132', passing: 'pass', name: 'ironman', skills: ['beam', 'flying!'] });
  await frame.execute();
});
