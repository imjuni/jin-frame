import { JinFile } from '#frames/JinFile';
import { JinFrame } from '#frames/JinFrame';
import { Post } from '#tools/decorators/methods/Post';
import MockAdapter from 'axios-mock-adapter';
import nock from 'nock';
import { afterEach, describe, expect, it } from 'vitest';

@Post({
  host: 'http://some.api.google.com/jinframe/:passing',
  contentType: 'multipart/form-data',
})
class Test001PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.param()
  declare public readonly passing: string;

  @JinFrame.body()
  declare public readonly username: string;

  @JinFrame.body()
  declare public readonly password: string;
}

@Post({
  host: 'http://some.api.google.com',
  path: '/jinframe/:passing',
  customBody: { sample: 'my-custom-body' },
})
class Test002PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.param()
  declare public readonly passing: string;

  @JinFrame.body()
  declare public readonly username: string;

  @JinFrame.body()
  declare public readonly password: string;
}

@Post({
  host: 'http://some.api.google.com',
  path: '/jinframe/:passing',
  contentType: 'application/x-www-form-urlencoded',
  transformRequest: (v) => `tr:${v}`,
})
class Test003PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.param()
  declare public readonly passing: string;

  @JinFrame.body()
  declare public readonly username: string;

  @JinFrame.body()
  declare public readonly password: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test004PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.param()
  declare public readonly passing: string[];

  @JinFrame.query()
  declare public readonly name: string[];

  @JinFrame.query()
  declare public readonly nums: number[];
}

@Post({ host: 'http://some.api.google.com/jinframe', useInstance: true })
class Test005PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.query()
  declare public readonly name: string[];

  @JinFrame.query()
  declare public readonly nums: number[];
}

describe('AbstractJinFrame', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('form-data', async () => {
    const frame = new Test001PostFrame({ username: 'ironman', password: 'avengers', passing: 'pass' });

    const fd = frame.getFormData({
      first: 'one',
      second: 'two',
      third: 3,
      fourth: true,
      fifth: { name: 'ironman' },
      sixth: new JinFile('f1', Buffer.from('test')),
      seventh: [new JinFile('f3', Buffer.from('test')), new JinFile('f3', Buffer.from('test'))],
    });

    expect(fd).toMatchObject({
      dataSize: 0,
      maxDataSize: 2097152,
      pauseStreams: true,
    });
  });

  it('body, param', async () => {
    const frame = new Test001PostFrame({ username: 'ironman', password: 'avengers', passing: 'pass' });

    frame.request();

    expect(frame.getData('body')).toMatchObject({ username: 'ironman', password: 'avengers' });
    expect(frame.getData('param')).toMatchObject({ passing: 'pass' });
  });

  it('form-data exception', async () => {
    try {
      const frame = new Test001PostFrame({ username: 'ironman', password: 'avengers', passing: 'pass' });

      const sym = Symbol('ironman');

      frame.getFormData({
        first: 'one',
        second: 'two',
        third: sym,
      });
    } catch (catched) {
      expect(catched).toBeDefined();
    }
  });

  it('user agent', async () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.61';
    const frame = new Test001PostFrame({ username: 'ironman', password: 'avengers', passing: 'pass' });
    const req = frame.request({ userAgent: ua });

    expect(req.headers?.['User-Agent']).toEqual(ua);
  });

  it('custom body', async () => {
    const frame = new Test002PostFrame({
      username: 'ironman',
      password: 'avengers',
      passing: 'pass',
    });

    const r = frame.request();

    expect(frame.getOption('host')).toEqual('http://some.api.google.com');
    expect(frame.getOption('path')).toEqual('/jinframe/:passing');
    expect(frame.getOption('method')).toEqual('POST');
    expect(frame.getOption('customBody')).toMatchObject({ sample: 'my-custom-body' });
    expect(frame.getOption('contentType')).toEqual('application/json');
    expect(r.data).toMatchObject({
      sample: 'my-custom-body',
    });
  });

  it('getTransformRequest', async () => {
    const frame = new Test003PostFrame({
      username: 'ironman',
      password: 'avengers',
      passing: 'pass',
    });

    const t = frame.getTransformRequest();
    expect(frame.getOption('transformRequest')).toBeTruthy();
    expect(t).toBeTruthy();
  });

  it('param, query', async () => {
    const frame = new Test004PostFrame({ name: ['ironman', 'captain'], passing: ['pass', 'fail'], nums: [1, 2, 3] });
    frame.request();

    expect(frame.getData('query')).toMatchObject({ name: ['ironman', 'captain'], nums: ['1', '2', '3'] });
    expect(frame.getData('param')).toMatchObject({ passing: 'pass,fail' });
  });

  it('array paths, queries', async () => {
    const frame = new Test004PostFrame({ name: ['ironman', 'captain'], passing: ['pass', 'fail'], nums: [1, 2, 3] });
    const r = frame.request();

    expect(r.url).toMatch(
      'http://some.api.google.com/jinframe/pass%2Cfail?name=ironman&name=captain&nums=1&nums=2&nums=3',
    );
  });

  it('create instance', async () => {
    const frame = new Test004PostFrame({
      name: ['ironman', 'captain'],
      passing: ['pass', 'fail'],
      nums: [1, 2, 3],
    });
    frame.request();

    expect(frame.getData('query')).toMatchObject({ name: ['ironman', 'captain'], nums: ['1', '2', '3'] });
    expect(frame.getData('param')).toMatchObject({ passing: 'pass,fail' });
  });

  it('mocking with instance', async () => {
    const frame = new Test005PostFrame({
      name: ['ironman', 'captain'],
      nums: [1, 2, 3],
    });

    const mock = new MockAdapter(frame.getData('instance'));
    const reply = { mock: { name: 'i am mock' } };

    mock.onPost().reply(200, reply);
    const response = await frame.execute();

    expect(response.data).toMatchObject(reply);
  });
});
