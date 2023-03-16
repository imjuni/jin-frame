/* eslint-disable max-classes-per-file */
import { JinFile } from '#frames/JinFile';
import { JinFrame } from '#frames/JinFrame';
import type { JinBuiltInMember, JinConstructorType, OmitConstructorType } from '#tools/ConstructorType';
import 'jest';
import nock from 'nock';

class Test001PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.param()
  public readonly passing!: string;

  @JinFrame.body()
  public readonly username!: string;

  @JinFrame.body()
  public readonly password!: string;

  constructor(args: JinConstructorType<Test001PostFrame>) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      contentType: 'multipart/form-data',
      method: 'post',
      ...args,
    });
  }
}

class Test002PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.param()
  public readonly passing!: string;

  @JinFrame.body()
  public readonly username!: string;

  @JinFrame.body()
  public readonly password!: string;

  constructor(args: OmitConstructorType<Test002PostFrame, Exclude<JinBuiltInMember, 'contentType' | 'customBody'>>) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'post',
      ...args,
    });
  }
}

class Test003PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.param()
  public readonly passing!: string;

  @JinFrame.body()
  public readonly username!: string;

  @JinFrame.body()
  public readonly password!: string;

  constructor(args: OmitConstructorType<Test003PostFrame, Exclude<JinBuiltInMember, 'customBody'>>) {
    super({
      method: 'post',
      ...args,
    });
  }
}

class Test004PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.param()
  public readonly passing!: string[];

  @JinFrame.query()
  public readonly name!: string[];

  @JinFrame.query()
  public readonly nums!: number[];

  constructor(args: JinConstructorType<Test004PostFrame>) {
    super({
      method: 'post',
      host: 'http://some.api.google.com/jinframe/:passing',
      ...args,
    });
  }
}

afterEach(() => {
  nock.cleanAll();
});

describe('AbstractJinFrame', () => {
  test('form-data', async () => {
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

  test('body, param', async () => {
    const frame = new Test001PostFrame({ username: 'ironman', password: 'avengers', passing: 'pass' });

    frame.request();

    expect(frame.$$body).toMatchObject({ username: 'ironman', password: 'avengers' });

    expect(frame.$$param).toMatchObject({ passing: 'pass' });
  });

  test('form-data exception', async () => {
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

  test('user agent', async () => {
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

  test('custom body', async () => {
    const frame = new Test002PostFrame({
      username: 'ironman',
      password: 'avengers',
      passing: 'pass',
      contentType: 'application/json',
      customBody: { sample: 'sample' },
    });

    const r = frame.request();

    expect(r.data).toMatchObject({
      sample: 'sample',
    });
  });

  test('host, path not pass exception', async () => {
    try {
      const frame = new Test003PostFrame({
        username: 'ironman',
        password: 'avengers',
        passing: 'pass',
        customBody: { sample: 'sample' },
      });

      frame.request();
    } catch (catched) {
      expect(catched).toBeDefined();
    }
  });

  test('getTransformRequest', async () => {
    const tr = (v: any) => `tr:${v}`;
    const frame = new Test002PostFrame({
      username: 'ironman',
      password: 'avengers',
      passing: 'pass',
      contentType: 'application/x-www-form-urlencoded',
      transformRequest: tr,
    });

    const t = frame.getTransformRequest();
    expect(t).toBe(tr);
  });

  test('param, query', async () => {
    const frame = new Test004PostFrame({ name: ['ironman', 'captain'], passing: ['pass', 'fail'], nums: [1, 2, 3] });
    frame.request();

    expect(frame.$$query).toMatchObject({ name: ['ironman', 'captain'], nums: [1, 2, 3] });
    expect(frame.$$param).toMatchObject({ passing: '["pass","fail"]' });
  });

  test('array paths, queries', async () => {
    const frame = new Test004PostFrame({ name: ['ironman', 'captain'], passing: ['pass', 'fail'], nums: [1, 2, 3] });
    const r = frame.request();

    expect(r.url).toMatch(
      'http://some.api.google.com/jinframe/[%22pass%22,%22fail%22]?name=ironman&name=captain&nums=1&nums=2&nums=3',
    );
  });
});
