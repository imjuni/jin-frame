import { JinFile } from '#frames/JinFile';
import { JinFrame } from '#frames/JinFrame';
import { Post } from '#decorators/methods/Post';
import { setupServer } from 'msw/node';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Param } from '#decorators/fields/Param';
import { Body } from '#decorators/fields/Body';
import { Query } from '#decorators/fields/Query';

@Post({
  host: 'http://some.api.google.com',
  pathPrefix: '/jinframe',
  path: '/{passing}',
  contentType: 'multipart/form-data',
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
  host: 'http://some.api.google.com',
  path: '/jinframe/{passing}',
  customBody: { sample: 'my-custom-body' },
})
class Test002PostFrame extends JinFrame<{ message: string }> {
  @Param()
  declare public readonly passing: string;

  @Body()
  declare public readonly username: string;

  @Body()
  declare public readonly password: string;
}

@Post({
  host: 'http://some.api.google.com',
  path: '/jinframe/{passing}',
  contentType: 'application/x-www-form-urlencoded',
})
class Test003PostFrame extends JinFrame<{ message: string }> {
  @Param()
  declare public readonly passing: string;

  @Body()
  declare public readonly username: string;

  @Body()
  declare public readonly password: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/{passing}' })
class Test004PostFrame extends JinFrame<{ message: string }> {
  @Param()
  declare public readonly passing: string[];

  @Query()
  declare public readonly name: string[];

  @Query()
  declare public readonly nums: number[];
}

describe('AbstractJinFrame', () => {
  // MSW server configuration
  const server = setupServer();

  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    server.close();
  });

  it('show return form-data when using getBodyInit with multipart/form-data', async () => {
    const frame = Test001PostFrame.of({ username: 'ironman', password: 'avengers', passing: 'pass' });

    const fd = frame._getBodyInit({
      first: 'one',
      second: 'two',
      third: 3,
      fourth: true,
      fifth: { name: 'ironman' },
      sixth: new JinFile('f1', Buffer.from('test')),
      seventh: [new JinFile('f3', Buffer.from('test')), new JinFile('f3', Buffer.from('test'))],
    });

    expect(fd).toBeInstanceOf(FormData);
  });

  it('should return body, param field when using @Body, @Param decorator', async () => {
    const frame = Test001PostFrame.of({ username: 'ironman', password: 'avengers', passing: 'pass' });

    frame._request();

    expect(frame._getData('body')).toMatchObject({ username: 'ironman', password: 'avengers' });
    expect(frame._getData('param')).toMatchObject({ passing: 'pass' });
  });

  it('should return param, query field when using @Param, @Query decorator', async () => {
    const frame = Test004PostFrame.of({ name: ['ironman', 'captain'], passing: ['pass', 'fail'], nums: [1, 2, 3] });
    frame._request();

    expect(frame._getData('query')).toMatchObject({ name: ['ironman', 'captain'], nums: ['1', '2', '3'] });
    expect(frame._getData('param')).toMatchObject({ passing: 'pass,fail' });
  });

  it('should return array param, array query field when using @Param, @Query decorator', async () => {
    const frame = Test004PostFrame.of({ name: ['ironman', 'captain'], passing: ['pass', 'fail'], nums: [1, 2, 3] });
    const r = frame._request();

    expect(r.url).toMatch(
      'http://some.api.google.com/jinframe/pass%2Cfail?name=ironman&name=captain&nums=1&nums=2&nums=3',
    );
  });

  it('should raise error in form-data when invalid type field pass to form-data', async () => {
    try {
      const frame = Test001PostFrame.of({ username: 'ironman', password: 'avengers', passing: 'pass' });

      const sym = Symbol('ironman');

      frame._getBodyInit({
        first: 'one',
        second: 'two',
        third: sym,
      });
    } catch (catched) {
      expect(catched).toBeDefined();
    }
  });

  it('should return custom user agent when pass user agent in request function', async () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.61';
    const frame = Test001PostFrame.of({ username: 'ironman', password: 'avengers', passing: 'pass' });
    const req = frame._request({ userAgent: ua });

    expect(req.headers?.['User-Agent']).toEqual(ua);
  });

  it('should return custom body when pass custom body from decorator', async () => {
    const frame = Test002PostFrame.of({
      username: 'ironman',
      password: 'avengers',
      passing: 'pass',
    });

    const r = frame._request();

    expect(frame._getOption('host')).toEqual('http://some.api.google.com');
    expect(frame._getOption('path')).toEqual('/jinframe/{passing}');
    expect(frame._getOption('method')).toEqual('POST');
    expect(frame._getOption('customBody')).toMatchObject({ sample: 'my-custom-body' });
    expect(frame._getOption('contentType')).toEqual('application/json');
    expect(JSON.parse(r.body as string)).toMatchObject({
      sample: 'my-custom-body',
    });
  });

  it('should return urlencoded body when content-type is application/x-www-form-urlencoded', async () => {
    const frame = Test003PostFrame.of({ username: 'ironman', password: 'avengers', passing: 'pass' });

    const r = frame._request();
    expect(typeof r.body).toBe('string');
    expect(r.body).toContain('username=ironman');
    expect(r.body).toContain('password=avengers');
  });

  it('should create instance and process query/param when instantiated', async () => {
    const frame = Test004PostFrame.of({
      name: ['ironman', 'captain'],
      passing: ['pass', 'fail'],
      nums: [1, 2, 3],
    });

    frame._request();

    expect(frame._getData('query')).toMatchObject({ name: ['ironman', 'captain'], nums: ['1', '2', '3'] });
    expect(frame._getData('param')).toMatchObject({ passing: 'pass,fail' });
  });
});

describe('_request with runtime host/pathPrefix/path override', () => {
  it('should override host at runtime', () => {
    const frame = Test001PostFrame.of({ username: 'ironman', password: 'avengers', passing: 'pass' });
    const req = frame._request({ host: 'http://staging.api.google.com' });
    expect(req.url).toContain('staging.api.google.com');
    expect(req.url).not.toContain('some.api.google.com');
  });

  it('should override path at runtime while keeping decorator pathPrefix', () => {
    const frame = Test001PostFrame.of({ username: 'ironman', password: 'avengers', passing: 'pass' });
    const req = frame._request({ path: '/override/{passing}' });
    expect(req.url).toContain('/override/pass');
    expect(req.url).toContain('/jinframe/');
  });

  it('should override pathPrefix at runtime', () => {
    const frame = Test001PostFrame.of({ username: 'ironman', password: 'avengers', passing: 'pass' });
    const req = frame._request({ pathPrefix: '/v2' });
    expect(req.url).toContain('/v2/');
    expect(req.url).not.toContain('/jinframe/');
  });

  it('should override all three at runtime', () => {
    const frame = Test001PostFrame.of({ username: 'ironman', password: 'avengers', passing: 'pass' });
    const req = frame._request({
      host: 'http://staging.api.google.com',
      pathPrefix: '/v2',
      path: '/override/{passing}',
    });
    expect(req.url).toBe('http://staging.api.google.com/v2/override/pass');
  });
});
