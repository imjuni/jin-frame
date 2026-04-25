import { JinFrame } from '#frames/JinFrame';
import { Get } from '#decorators/methods/Get';
import type { JinRequestConfig } from '#interfaces/JinRequestConfig';
import type { JinResp } from '#interfaces/JinResp';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Param } from '#decorators/fields/Param';
import { Query } from '#decorators/fields/Query';

@Get({ host: 'http://some.api.google.com/jinframe/{passing}' })
class TestGet3Frame extends JinFrame {
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

  override $_preHook(req: JinRequestConfig): void {
    console.log('pre hook trigger: ', req);
  }

  override $_postHook(req: JinRequestConfig, reply: JinResp<unknown, unknown>): void {
    console.log('post hook trigger: ', req);
    console.log(reply);
  }
}

@Get({ host: 'http://some.api.google.com/jinframe/{passing}' })
class TestGet4Frame extends JinFrame {
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

  override async $_preHook(req: JinRequestConfig): Promise<void> {
    console.log('pre hook trigger: ', req);
  }

  override async $_postHook(req: JinRequestConfig, reply: JinResp<unknown, unknown>): Promise<void> {
    console.log('post hook trigger: ', req);
    console.log(reply);
  }
}

@Get({ host: 'http://some.api.google.com/jinframe/{passing}' })
class TestGet5Frame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @Query()
  declare public readonly name: string;

  @Query({ encode: false, keyFormat: 'indices' })
  declare public readonly skill: string[];

  constructor() {
    super();

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];
  }

  override $_preHook(req: JinRequestConfig): void {
    console.log('pre hook trigger: ', req);
  }
}

@Get({ host: 'http://some.api.google.com/jinframe/{passing}' })
class TestGet6Frame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @Query()
  declare public readonly name: string;

  @Query({ encode: false, keyFormat: 'brackets' })
  declare public readonly skill: string[];

  constructor() {
    super();

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];
  }

  override async $_preHook(req: JinRequestConfig): Promise<void> {
    console.log('pre hook trigger: ', req);
  }
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

  it('msw-with-fetch', async () => {
    server.use(
      http.get('http://some.api.google.com/test', () =>
        HttpResponse.json({
          message: 'hello',
        }),
      ),
    );

    await fetch('http://some.api.google.com/test');
  });

  it('jin-frame pre hook', async () => {
    server.use(
      http.get('http://some.api.google.com/jinframe/pass', ({ request }) => {
        const url = new URL(request.url);
        const name = url.searchParams.get('name');
        const skills = url.searchParams.getAll('skill');

        if (name === 'ironman' && skills.includes('beam') && skills.includes('flying!')) {
          return HttpResponse.json({
            message: 'hello',
          });
        }

        return new HttpResponse(null, { status: 404 });
      }),
    );

    const frame = new TestGet3Frame();
    const resp = await frame._execute();

    expect(resp.status).toEqual(200);
  });

  it('jin-frame post hook fail case', async () => {
    server.use(
      http.get('http://some.api.google.com/jinframe/pass', ({ request }) => {
        const url = new URL(request.url);
        const name = url.searchParams.get('name');
        const skills = url.searchParams.getAll('skill');

        if (name === 'ironman' && skills.includes('beam') && skills.includes('flying!')) {
          return HttpResponse.json(
            {
              message: 'hello',
            },
            { status: 400 },
          );
        }

        return new HttpResponse(null, { status: 404 });
      }),
    );

    try {
      const frame = new TestGet3Frame();
      await frame._execute();
    } catch (caught) {
      expect(caught).toBeTruthy();
    }
  });

  it('jin-frame with async pre hook', async () => {
    server.use(
      http.get('http://some.api.google.com/jinframe/pass', ({ request }) => {
        const url = new URL(request.url);
        const name = url.searchParams.get('name');
        const skills = url.searchParams.getAll('skill');

        if (name === 'ironman' && skills.includes('beam') && skills.includes('flying!')) {
          return HttpResponse.json({
            message: 'hello',
          });
        }

        return new HttpResponse(null, { status: 404 });
      }),
    );

    const frame = new TestGet4Frame();
    const resp = await frame._execute();

    expect(resp.status).toEqual(200);
  });

  it('jin-frame async post hook fail case', async () => {
    server.use(
      http.get('http://some.api.google.com/jinframe/pass', ({ request }) => {
        const url = new URL(request.url);
        const name = url.searchParams.get('name');
        const skills = url.searchParams.getAll('skill');

        if (name === 'ironman' && skills.includes('beam') && skills.includes('flying!')) {
          return HttpResponse.json(
            {
              message: 'hello',
            },
            { status: 400 },
          );
        }

        return new HttpResponse(null, { status: 404 });
      }),
    );

    try {
      const frame = new TestGet4Frame();
      await frame._execute();
    } catch (caught) {
      expect(caught).toBeTruthy();
    }
  });

  it('jin-frame with async pre hook - no return', async () => {
    server.use(
      http.get('http://some.api.google.com/jinframe/pass', ({ request }) => {
        const url = new URL(request.url);
        const name = url.searchParams.get('name');
        const skill0 = url.searchParams.get('skill[0]');
        const skill1 = url.searchParams.get('skill[1]');

        if (name === 'ironman' && skill0 === 'beam' && skill1 === 'flying!') {
          return HttpResponse.json({
            message: 'hello',
          });
        }

        return new HttpResponse(null, { status: 404 });
      }),
    );

    const frame = new TestGet5Frame();
    const resp = await frame._execute();

    expect(resp.status).toEqual(200);
  });

  it('jin-frame with brackets key format', async () => {
    server.use(
      http.get('http://some.api.google.com/jinframe/pass', ({ request }) => {
        const url = new URL(request.url);
        const name = url.searchParams.get('name');
        const skills = url.searchParams.getAll('skill[]');

        if (name === 'ironman' && skills.includes('beam') && skills.includes('flying!')) {
          return HttpResponse.json({
            message: 'hello',
          });
        }

        return new HttpResponse(null, { status: 404 });
      }),
    );

    const frame = new TestGet6Frame();
    const resp = await frame._execute();

    expect(resp.status).toEqual(200);
  });
});
