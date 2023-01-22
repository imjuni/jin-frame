/* eslint-disable max-classes-per-file */

import { JinEitherFrame } from '@frames/JinEitherFrame';
import axios from 'axios';
import { isPass } from 'my-only-either';
import nock from 'nock';

class TestGetFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.query()
  public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  public readonly skill: string[];

  constructor() {
    super({ host: 'http://some.api.google.com', path: '/jinframe/:passing', method: 'get' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];
  }
}

class TestGet2Frame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.query()
  public readonly name: string;

  @JinEitherFrame.header()
  public readonly ttt: string;

  constructor(host: string) {
    super({ host, path: '/jinframe/:passing/test', method: 'get' });

    this.passing = 'hello';
    this.name = 'ironman';
    this.ttt = 'header value';
  }
}

describe('jinframe.test', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  test('nock-with-axios', async () => {
    nock('http://some.api.google.com').get('/test').reply(200, {
      message: 'hello',
    });

    await axios.get('http://some.api.google.com/test');
  });

  test('nock-get01-with-jinframe', async () => {
    nock('http://some.api.google.com').get('/jinframe/pass?name=ironman&skill=beam&skill=flying!').reply(200, {
      message: 'hello',
    });

    const frame = new TestGetFrame();
    const resp = await frame.execute();

    expect(isPass(resp)).toEqual(true);
  });

  test('nock-get02-with-jinframe', async () => {
    nock('http://some.api.google.com').get('/jinframe/hello/test?name=ironman').reply(200, {
      message: 'hello',
    });

    const frame = new TestGet2Frame('http://some.api.google.com');
    const resp = await frame.execute();

    expect(isPass(resp)).toEqual(true);
  });

  test('nock-get03-axios-request', async () => {
    nock('http://some.api.google.com').get('/jinframe/hello/test?name=ironman').reply(200, {
      message: 'hello',
    });

    const frame = new TestGet2Frame('http://some.api.google.com');
    const req = frame.request();
    try {
      const resp = await axios.get(req.url ?? '', { ...req, validateStatus: () => true });

      expect(resp.status < 400).toEqual(true);
    } catch (err) {
      expect(err).toBeFalsy();
    }
  });
});
