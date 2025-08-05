import { JinFile } from '#frames/JinFile';
import { JinFrame } from '#frames/JinFrame';
import type { JinConstructorType } from '#tools/type-utilities/JinConstructorType';
import MockAdapter from 'axios-mock-adapter';
import nock from 'nock';
import { afterEach, describe, expect, it } from 'vitest';

class Test001PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.param()
  public declare readonly passing: string;

  @JinFrame.body()
  public declare readonly username: string;

  @JinFrame.body()
  public declare readonly password: string;

  constructor(args: JinConstructorType<Test001PostFrame>) {
    super({
      ...args,
      $$host: 'http://some.api.google.com/jinframe/:passing',
      $$contentType: 'multipart/form-data',
      $$method: 'post',
    });
  }
}

class Test002PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.param()
  public declare readonly passing: string;

  @JinFrame.body()
  public declare readonly username: string;

  @JinFrame.body()
  public declare readonly password: string;

  constructor(args: JinConstructorType<Test002PostFrame>) {
    super({
      ...args,
      $$host: 'http://some.api.google.com',
      $$path: '/jinframe/:passing',
      $$method: 'post',
    });
  }
}

class Test003PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.param()
  public declare readonly passing: string;

  @JinFrame.body()
  public declare readonly username: string;

  @JinFrame.body()
  public declare readonly password: string;

  constructor(args: JinConstructorType<Test003PostFrame>) {
    super({
      $$method: 'post',
      ...args,
    });
  }
}

class Test004PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.param()
  public declare readonly passing: string[];

  @JinFrame.query()
  public declare readonly name: string[];

  @JinFrame.query()
  public declare readonly nums: number[];

  constructor(args: JinConstructorType<Test004PostFrame>) {
    super({
      ...args,
      $$method: 'post',
      $$host: 'http://some.api.google.com/jinframe/:passing',
    });
  }
}

class Test005PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.query()
  public declare readonly name: string[];

  @JinFrame.query()
  public declare readonly nums: number[];

  constructor(args: JinConstructorType<Test005PostFrame>) {
    super({
      ...args,
      $$method: 'post',
      $$host: 'http://some.api.google.com/jinframe',
    });
  }
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

    expect(frame.$$body).toMatchObject({ username: 'ironman', password: 'avengers' });
    expect(frame.$$param).toMatchObject({ passing: 'pass' });
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
    const frame = new Test001PostFrame({ username: 'ironman', password: 'avengers', passing: 'pass' });

    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.61';
    const r = frame.request({
      userAgent: ua,
    });

    expect(r).toMatchObject({
      userAgent: ua,
    });
  });

  it('custom body', async () => {
    const frame = new Test002PostFrame({
      username: 'ironman',
      password: 'avengers',
      passing: 'pass',
      $$contentType: 'application/json',
      $$customBody: { sample: 'sample' },
    });

    const r = frame.request();

    expect(frame.$$host).toEqual('http://some.api.google.com');
    expect(frame.$$path).toEqual('/jinframe/:passing');
    expect(frame.$$method).toEqual('post');
    expect(frame.$$customBody).toMatchObject({ sample: 'sample' });
    expect(frame.$$contentType).toEqual('application/json');
    expect(r.data).toMatchObject({
      sample: 'sample',
    });
  });

  it('host, path not pass exception', async () => {
    try {
      const frame = new Test003PostFrame({
        username: 'ironman',
        password: 'avengers',
        passing: 'pass',
        $$customBody: { sample: 'sample' },
      });

      frame.request();
    } catch (catched) {
      expect(catched).toBeDefined();
    }
  });

  it('getTransformRequest', async () => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const tr = (v: any) => `tr:${v}`;
    const frame = new Test002PostFrame({
      username: 'ironman',
      password: 'avengers',
      passing: 'pass',
      $$contentType: 'application/x-www-form-urlencoded',
      $$transformRequest: tr,
    });

    const t = frame.getTransformRequest();
    expect(frame.$$transformRequest).toBeTruthy();
    expect(t).toBe(tr);
  });

  it('param, query', async () => {
    const frame = new Test004PostFrame({ name: ['ironman', 'captain'], passing: ['pass', 'fail'], nums: [1, 2, 3] });
    frame.request();

    expect(frame.$$query).toMatchObject({ name: ['ironman', 'captain'], nums: [1, 2, 3] });
    expect(frame.$$param).toMatchObject({ passing: '["pass","fail"]' });
  });

  it('array paths, queries', async () => {
    const frame = new Test004PostFrame({ name: ['ironman', 'captain'], passing: ['pass', 'fail'], nums: [1, 2, 3] });
    const r = frame.request();

    expect(r.url).toMatch(
      'http://some.api.google.com/jinframe/%5B%22pass%22%2C%22fail%22%5D?name=ironman&name=captain&nums=1&nums=2&nums=3',
    );
  });

  it('create instance', async () => {
    const frame = new Test004PostFrame({
      name: ['ironman', 'captain'],
      passing: ['pass', 'fail'],
      nums: [1, 2, 3],
      $$instance: true,
    });
    frame.request();

    expect(frame.$$query).toMatchObject({ name: ['ironman', 'captain'], nums: [1, 2, 3] });
    expect(frame.$$param).toMatchObject({ passing: '["pass","fail"]' });
  });

  it('mocking with instance', async () => {
    const frame = new Test005PostFrame({
      name: ['ironman', 'captain'],
      nums: [1, 2, 3],
      $$instance: true,
    });

    const mock = new MockAdapter(frame.$$instance);
    const reply = { mock: { name: 'i am mock' } };

    mock.onPost().reply(200, reply);
    const response = await frame.execute();

    expect(response.data).toMatchObject(reply);
  });
});
