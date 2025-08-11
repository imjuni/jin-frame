import { JinFile } from '#frames/JinFile';
import { JinFrame } from '#frames/JinFrame';
import { ConstructorType } from '#tools/type-utilities/ConstructorType';
import { IFrameOption } from '#tools/type-utilities/IFrameOption';
import MockAdapter from 'axios-mock-adapter';
import nock from 'nock';
import { afterEach, describe, expect, it } from 'vitest';

class Test001PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.param()
  declare public readonly passing: string;

  @JinFrame.body()
  declare public readonly username: string;

  @JinFrame.body()
  declare public readonly password: string;

  constructor(args: ConstructorType<Test001PostFrame>, option?: Partial<IFrameOption>) {
    super(args, {
      host: 'http://some.api.google.com/jinframe/:passing',
      contentType: 'multipart/form-data',
      method: 'post',
      ...option,
    });
  }
}

class Test002PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.param()
  declare public readonly passing: string;

  @JinFrame.body()
  declare public readonly username: string;

  @JinFrame.body()
  declare public readonly password: string;

  constructor(args: ConstructorType<Test002PostFrame>, option?: Partial<IFrameOption>) {
    super(args, {
      host: 'http://some.api.google.com',
      path: '/jinframe/:passing',
      method: 'post',
      ...(option ?? {}),
    });
  }
}

class Test004PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.param()
  declare public readonly passing: string[];

  @JinFrame.query()
  declare public readonly name: string[];

  @JinFrame.query()
  declare public readonly nums: number[];

  constructor(args: ConstructorType<Test004PostFrame>, option?: Partial<IFrameOption>) {
    super(args, {
      method: 'post',
      host: 'http://some.api.google.com/jinframe/:passing',
      ...option,
    });
  }
}

class Test005PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.query()
  declare public readonly name: string[];

  @JinFrame.query()
  declare public readonly nums: number[];

  constructor(args: ConstructorType<Test005PostFrame>, option?: Partial<IFrameOption>) {
    super(args, {
      method: 'post',
      host: 'http://some.api.google.com/jinframe',
      ...option,
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
    const frame = new Test001PostFrame(
      { username: 'ironman', password: 'avengers', passing: 'pass' },
      {
        userAgent: ua,
      },
    );

    expect(frame.getOption('userAgent')).toEqual(ua);
  });

  it('custom body', async () => {
    const frame = new Test002PostFrame(
      {
        username: 'ironman',
        password: 'avengers',
        passing: 'pass',
      },
      {
        contentType: 'application/json',
        customBody: { sample: 'sample' },
      },
    );

    const r = frame.request();

    expect(frame.getOption('host')).toEqual('http://some.api.google.com');
    expect(frame.getOption('path')).toEqual('/jinframe/:passing');
    expect(frame.getOption('method')).toEqual('post');
    expect(frame.getOption('customBody')).toMatchObject({ sample: 'sample' });
    expect(frame.getOption('contentType')).toEqual('application/json');
    expect(r.data).toMatchObject({
      sample: 'sample',
    });
  });

  it('getTransformRequest', async () => {
    const tr = (v: any) => `tr:${v}`;
    const frame = new Test002PostFrame(
      {
        username: 'ironman',
        password: 'avengers',
        passing: 'pass',
      },
      {
        contentType: 'application/x-www-form-urlencoded',
        transformRequest: tr,
      },
    );

    const t = frame.getTransformRequest();
    expect(frame.getOption('transformRequest')).toBeTruthy();
    expect(t).toBe(tr);
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
    const frame = new Test004PostFrame(
      {
        name: ['ironman', 'captain'],
        passing: ['pass', 'fail'],
        nums: [1, 2, 3],
      },
      { useInstance: true },
    );
    frame.request();

    expect(frame.getData('query')).toMatchObject({ name: ['ironman', 'captain'], nums: ['1', '2', '3'] });
    expect(frame.getData('param')).toMatchObject({ passing: 'pass,fail' });
  });

  it('mocking with instance', async () => {
    const frame = new Test005PostFrame(
      {
        name: ['ironman', 'captain'],
        nums: [1, 2, 3],
      },
      {
        useInstance: true,
      },
    );

    const mock = new MockAdapter(frame.getData('instance'));
    const reply = { mock: { name: 'i am mock' } };

    mock.onPost().reply(200, reply);
    const response = await frame.execute();

    expect(response.data).toMatchObject(reply);
  });
});
